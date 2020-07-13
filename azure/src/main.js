const { InitialClusters } = require('./lib/systems/init');
const cluster = require('cluster');
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose
	.connect(`mongodb://localhost/logs_azure`, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		poolSize: 10,
	})
	.then(() => {
		console.log(`Server connect to Database logs_azure`);
	});
mongoose.connection.on('error', (err) => {
	console.log(`DB connection error: ${err.message}`);
});
Promise.promisifyAll(require('mongoose'));

if (cluster.isMaster) {
	InitialClusters();
	require('./controllers/subscriber.js');
} else if (cluster.isWorker) {
	require('./controllers/subscriber.js');
}
