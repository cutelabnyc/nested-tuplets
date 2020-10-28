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
		const { length, beatRatio, normalizedOnsetTimes } = p;
		const scaledOnsetTimes = normalizedOnsetTimes.map(t => t / (length * beatRatio) + beatOffset);
		beatOffset += (1.0 / (length * beatRatio));
		onsets = onsets.concat(scaledOnsetTimes);
	});
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
