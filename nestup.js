const maxApi = require("max-api");
const RhythmParser = require("./src/parser");
const Phrase = require("./src/phrase");

function normalizedOnsetTimes(phrases) {
	// Collect the total number of beats
	const totalBeats = phrases.reduce((prev, {length, beatRatio}) => prev + length * beatRatio, 0);

	// Scale the normalized onset times in each phrase by the beat length in each phrase
	let beatOffset = 0;
	let onsets = [];
	phrases.forEach(p => {
		const { length, beatRatio } = p;
		const times = p.normalizedOnsetTimes();
		const scaledOnsetTimes = times.map(t => (beatOffset + (length * beatRatio / totalBeats) * t));
		beatOffset += (length * beatRatio) / totalBeats;
		onsets = onsets.concat(scaledOnsetTimes);
	});

	return onsets;
}

function process(text) {
	const parser = new RhythmParser();
	const results = parser.parse(text);
	const phrases = results.map(r => new Phrase(r));
	const times = normalizedOnsetTimes(phrases);
	return times;
}

maxApi.addHandler("parse", (text) => {
	try {
		const times = process(text);
		maxApi.outlet(["times"].concat(times));
	} catch (e) {
		maxApi.post(e.message);
		maxApi.outlet("error");
	}
});
