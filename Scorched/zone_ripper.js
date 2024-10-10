const fs = require('node:fs');
const path = require('node:path');
//const tz = require('time_zone.csv');

const tzPath = path.join(__dirname, 'time_zone.csv');
fs.readFile(tzPath, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	const output = {};
	const lines = data.split('\n');
	let zones = 0;
	for (let i = 0; i < lines.length - 1; i++) {
		const line = lines[i].split(',');

		const abr = line[2].toLowerCase();
		const reg = line[0];

		if (!Object.hasOwn(output, abr)) {
			output[abr] = reg;
			zones++;
		}
	}

	fs.writeFile(path.join(__dirname, 'zones.json'), JSON.stringify(output), err => {
		if (err) {
			console.error(err);
		} else {
			console.log(`Completed with ${zones} time zones!`);
		}
	});
});