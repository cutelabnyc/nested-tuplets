const midiWriter = require("midi-writer-js");

module.exports = function writeOnsetsAsMidi(nestup, pitch, ticks, outfile) {
	// Assume 4 beats to one measure
	const track = new midiWriter.Track();
	const tickedOnsets = nestup.tickSnappedEvents(ticks);
	tickedOnsets.forEach((onset, idx) => {
		console.log(onset);
		track.addEvent(new midiWriter.NoteEvent({
			pitch: pitch,
			duration: "T" + onset.duration
		}));
	});

	const write = new midiWriter.Writer(track);
	write.saveMIDI(outfile);
}
