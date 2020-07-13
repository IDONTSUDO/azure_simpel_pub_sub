const logs = require('./models/logs');

exports.helper = async (req) => {
	let log = new logs();
	log.logUUID = req;
	let result = await log.save();
	if (result) {
		return true;
	} else {
		return Error('DOC save err');
	}
};
