require("mocha");
const { expect } = require("chai");
const { Container, RhythmParser, Nestup, Onset } = require("../index");
const Fraction = require("fraction.js");

describe("Rotations", () => {
	it("encodes right rotation", () => {
		const input = `[2] {1 > 1/4}`;
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

	it("encodes left rotation", () => {
		const input = `[2] {1 < 1/4}`;
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
