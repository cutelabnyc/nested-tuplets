const Onset = require("./onset");

function normalizedOnsets(phrases) {
	// Collect the total number of beats
	const totalBeats = phrases.reduce((prev, {length, beatRatio}) => prev + length * beatRatio, 0);

	// Scale the normalized onset times in each phrase by the beat length in each phrase
	let beatOffset = 0;
	let onsets = [];
	phrases.forEach(p => {
		const { length, beatRatio } = p;
		const phraseOnsets = p.normalizedOnsets();
		const scaledOnsetTimes = phraseOnsets.map(po => new Onset(
			(beatOffset + (length * beatRatio / totalBeats) * po.time),
			po.path)
		);
		beatOffset += (length * beatRatio) / totalBeats;
		onsets = onsets.concat(scaledOnsetTimes);
	});

	return onsets;
}

module.exports = {
	normalizedOnsets
};
