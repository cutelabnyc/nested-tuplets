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

module.exports = {
	normalizedOnsetTimes
};
