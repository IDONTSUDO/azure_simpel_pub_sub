let errCounter = 0;
let errLOGS = [];
exports.errSys = (err) => {
	console.log(err);
	errLOGS.push(err);
	if (errCounter === 4) {
		// any logic reporter
		process.exit(-1);
	}
	errCounter++;
};
