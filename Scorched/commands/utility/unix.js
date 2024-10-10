/* eslint-disable no-inline-comments */
/* eslint-disable no-multi-spaces */
const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const zones = GetAbr();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unix')
		.setDescription('Convert a local time to a UNIX timestamp')
		.addIntegerOption(option =>
			option.setName('hour')
				.setDescription('The hour of the timestamp')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('minute')
				.setDescription('The minute of the timestamp')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('abr')
				.setDescription('The abbreviated timezone')
				.setRequired(true),
		),
	async execute(interaction) {
		const op = interaction.options;
		const now = new Date();

		const date = Date.UTC(
			op.getInteger('year') ?? now.getFullYear(),
			op.getInteger('month') ?? now.getMonth(),
			op.getInteger('day') ?? now.getDate(),
			op.getInteger('hour') ?? now.getHours(),
			op.getInteger('minute') ?? now.getMinutes(),
		);

		//console.log(op.getString('abr').toLowerCase());
		//console.log(zones[op.getString('abr').toLowerCase()]);

		const abr = op.getString('abr').toLowerCase();
		const timezone = zones[abr];
		if (timezone === undefined) {
			await interaction.reply({ content: `Timezone ${abr} could not find a suitable IANA timezone!`, ephemeral: true });
			return;
		}
		const unixTimestamp = await localToUNIX(date, );
		await interaction.reply(`<t:${unixTimestamp}:t> [${unixTimestamp}]`);
	},
};

async function localToUNIX(date, localZone) {
	const localUnix = DateToUnix(date);

	let UTCoffset = 0;

	await GetUTCOffeset(localZone).then((value) => {
		UTCoffset = value;
	});

	const adjustedTime = localUnix - UTCoffset;
	return adjustedTime;
}

function DateToUnix(date) {
	return Math.floor(date.valueOf() / 1000);
}

async function GetUTCOffeset(zone) {
	let out = 'Haha your promise broke, nerrrrd.';// Declare output and set to debug message.
	let jsonPromise;                              // Declare variable to store response promise.

	await fetch('https://timeapi.io/api/timezone/zone?timeZone=' + zone, {
		method: 'GET',
	}).then((response) => {                       // Wait for the API to respond.
		jsonPromise = response.json();            // Parse response to obtain body.
	});

	await jsonPromise.then((data) => {            // Wait for the JSON to be parsed.
		out = data.currentUtcOffset.milliseconds; // Get UTC offset in milliseconds.
	});

	return (out / 1000);                          // Return the UTC offset in milliseconds.
}

function GetAbr() {
	const tzPath = path.join(__dirname, '../../zones.json');
	return JSON.parse(fs.readFileSync(tzPath, 'utf8'));
}