const midiWriter = require("midi-writer-js");

module.exports = function writeTimesAsMidi(normalizedTimes, outfile) {
	// Assume 4 beats to one measure
	const track = new midiWriter.Track();
	normalizedTimes.forEach((time, idx) => {
		const nextEventTime = idx < (normalizedTimes.length - 1) ? normalizedTimes[idx + 1] : 1.0;
		const thisEventTicks = Math.floor(time * 128 * 4);
		const nextEventTicks = Math.floor(nextEventTime * 128 * 4);
		track.addEvent(new midiWriter.NoteEvent({
			pitch: "C3",
			duration: "T" + (nextEventTicks - thisEventTicks)
		}));
	});

	const write = new midiWriter.Writer(track);
	write.saveMIDI(outfile);
}
