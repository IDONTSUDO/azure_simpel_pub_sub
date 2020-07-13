const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
	logUUID: {
		type: String,
	},
});
module.exports = mongoose.model('LOGS', logSchema);
