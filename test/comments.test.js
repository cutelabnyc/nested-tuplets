require("mocha");
const { expect } = require("chai");
const { RhythmParser, Nestup } = require("../index");
const Fraction = require("fraction.js");

describe("Comments", () => {
	it("encodes right rotation, with a comment", () => {
		const input =
`[2 // This is a comment
] {1 > 1/4}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(nestup.beatLength).to.equal(2);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(2);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(25);
		expect(midiLikeEvents[1].time).to.equal(100);
	});

	it("encodes left rotation, with comments", () => {
		const input =
`// This is a comment

// And another
[2] {1 < 1/4}
// One more comment for the road`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(nestup.beatLength).to.equal(2);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(2);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(75);
		expect(midiLikeEvents[1].time).to.equal(100);
	});
});
