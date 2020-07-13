const test = require('firebase-functions-test')();
const functions = require('../index.js');
describe('onEpisodeTrackCreated', () => {
    it('successfully invokes function', async () => {
        const wrapped = test.wrap(functions.onEpisodeTrackCreated);
        const data = { name: 'hello - world', broadcastAt: new Date() }
        await wrapped({
            data: () => ({
                name: 'hello - world'
            }),
            ref: {
                set: jest.fn()
            }
        })
    })
})