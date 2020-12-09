const midiWriter = require("midi-writer-js");

module.exports = function writeOnsetsAsMidi(nestup, pitch, ticks, outfile) {
	// Assume 4 beats to one measure
	const track = new midiWriter.Track();
	const midiLikeEvents = nestup.onOffEvents(ticks);
	let lastEvent = null;

	let tickCounter = 0;
	let noteStartTick = 0;
	midiLikeEvents.forEach((event) => {

		if (event.on) {
			noteStartTick = event.time;
		}

		else {
			const duration = event.time - noteStartTick;
			const wait = noteStartTick - tickCounter;

			track.addEvent(new midiWriter.NoteEvent({
				pitch: pitch,
				duration: "T" + duration,
				wait: "T" + wait
			}));

			tickCounter += (wait + duration);
		}
	});

	const write = new midiWriter.Writer(track);
	write.saveMIDI(outfile);
}
