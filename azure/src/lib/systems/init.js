const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

exports.InitialClusters = async () => {
	// for (let i = 0; i < numCPUs; i++) {
	// 	cluster.fork();
	// }
};
