const functions = require('firebase-functions');
const admin = require('firebase-admin');
const env = require('./env.json')
const { QueueServiceClient, AnonymousCredential } = require("@azure/storage-queue");

admin.initializeApp();


exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = await admin.firestore().collection('messages').add({ original: original });
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.publisherBD =  functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data().original;
        const uppercase = original.toUpperCase();
       
        // eslint-disable-next-line promise/always-return
        return publisher(JSON.stringify(original)).then(() => { snap.ref.set({ uppercase }, { merge: true }); })
    });


/**@description публикует в azure документы добавленные в колекцию
 * @param {*} JSON.stringify(document) FIRESTORE колекция
 * @return { void } void
 */
async function publisher(document) {
    functions.logger.log('ITS WORK', document);
    const account = env.account
    const accountSas = env.markerSAS
    const anonymousCredential = new AnonymousCredential();

    const queueServiceClient = new QueueServiceClient(
        `https://${account}.queue.core.windows.net${accountSas}`,
        anonymousCredential
    );

    const queueName = env.queueName
    const queueClient = queueServiceClient.getQueueClient(queueName);
    const result = await queueClient.sendMessage(document);
    if (!result) {
        functions.logger.log('Azure cloude err', document);
    }
}