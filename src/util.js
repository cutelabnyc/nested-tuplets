const Fraction = require("fraction.js");
const Onset = require("./onset");

function normalizedOnsets(phrases) {
	// Collect the total number of beats
	const totalBeats = phrases.reduce((prev, {length, beatRatio}) => beatRatio.mul(length).add(prev), new Fraction(0));

	// Scale the normalized onset times in each phrase by the beat length in each phrase
	let beatOffset = new Fraction(0);
	let onsets = [];
	phrases.forEach(p => {
		const { length, beatRatio } = p;
		const phraseOnsets = p.normalizedOnsets();
		const scaledOnsetTimes = phraseOnsets.map(po => new Onset(
			beatRatio.mul(length).mul(po.time).div(totalBeats).add(beatOffset),
			po.path)
		);
		beatOffset = beatOffset.add(beatRatio.mul(length).div(totalBeats));
		onsets = onsets.concat(scaledOnsetTimes);
	});

	return onsets;
}

module.exports = {
	normalizedOnsets
};
