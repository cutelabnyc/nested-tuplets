const midiWriter = require("midi-writer-js");
const Fraction = require("fraction.js");

module.exports = function writeOnsetsAsMidi(normalizedTimes, outfile) {
	// Assume 4 beats to one measure
	const track = new midiWriter.Track();
	normalizedTimes.forEach((onset, idx) => {
		const nextEventTime = idx < (normalizedTimes.length - 1) ? normalizedTimes[idx + 1].time : new Fraction(1);
		const thisEventTicks = Math.floor(onset.time.mul(128).mul(4).valueOf());
		const nextEventTicks = Math.floor(nextEventTime.mul(128).mul(4).valueOf());
		track.addEvent(new midiWriter.NoteEvent({
			pitch: "C3",
			duration: "T" + (nextEventTicks - thisEventTicks)
		}));
	});

	const write = new midiWriter.Writer(track);
	write.saveMIDI(outfile);
}
