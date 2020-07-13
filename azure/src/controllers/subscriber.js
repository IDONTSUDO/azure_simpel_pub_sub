const { QueueServiceClient, StorageSharedKeyCredential } = require('@azure/storage-queue');
const { DefaultAzureCredential } = require('@azure/identity');
const { to } = require('../lib/helper/to');
const { PromisedTimeout } = require('../lib/helper/promise-timeout');
const { debounce } = require('../lib/helper/debounce');
const { compose } = require('../lib/helper/compose');
const { errSys } = require('../lib/systems/sys_err');

const env = require('../config/env.json');
const sharedKeyCredential = new StorageSharedKeyCredential(env.account, env.accountKey);

// const defaultAzureCredential = new DefaultAzureCredential();
const { helper } = require('./helper.js');

const queueServiceClient = new QueueServiceClient(`https://${env.account}.queue.core.windows.net`, sharedKeyCredential, {
	retryOptions: { maxTries: 4 },
	telemetry: { value: 'BasicSample/V11.0.0' },
});

async function main() {
	const queueClient = await queueServiceClient.getQueueClient(env.queueName);
	await queueClient.sendMessage('Hello World!');

	const dequeueResponse = await queueClient.receiveMessages();
	const dequeueMessageItem = dequeueResponse.receivedMessageItems[0];
	if (dequeueMessageItem.length == 1) {
		return true;
	}

	let result = await helper(dequeueMessageItem.messageId);
	if (result) {
		const deleteMessageResponse = await queueClient.deleteMessage(dequeueMessageItem.messageId, dequeueMessageItem.popReceipt);
		if (deleteMessageResponse) {
			// any logic
		}

		return true;
	} else {
		return false;
	}
}

let PROCESSS_STATE;
async function loop() {
	PROCESSS_STATE = await main();
	if (PROCESSS_STATE instanceof Error) {
		let e = PROCESSS_STATE;
		errSys(e);
	}
	if (!PROCESSS_STATE) {
		const [err, quote] = await to(main);
		if (err || !quote) {
			throw Error(err ? err : 'Unknown Err');
		}
	}
	loop()
}
loop();
