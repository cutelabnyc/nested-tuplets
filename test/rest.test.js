require("mocha");
const { expect } = require("chai");
const { Container, RhythmParser, Nestup, Onset } = require("../index");
const Fraction = require("fraction.js");

describe("Rests", () => {
	it("encodes a lagging rest", () => {
		const input = `[[2] ['2]]`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const container = new Container(parseTree[0]);

		const onsets = container.normalizedOnsets();
		expect(onsets).to.have.length(3);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 2))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(1))).to.be.true;

		expect(nestup.beatLength).to.equal(4);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(2);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(0);
		expect(midiLikeEvents[1].time).to.equal(50);
	});

	it("encodes a leading rest", () => {
		const input = `[['2] [2]]`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const container = new Container(parseTree[0]);

		const onsets = container.normalizedOnsets();
		expect(onsets).to.have.length(3);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 2))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(1))).to.be.true;

		expect(nestup.beatLength).to.equal(4);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(2);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(50);
		expect(midiLikeEvents[1].time).to.equal(100);
	});

	it("handles an awkward double rest", () => {
		const input = `[['2] ['2]]`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const container = new Container(parseTree[0]);

		const onsets = container.normalizedOnsets();
		expect(onsets).to.have.length(2);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 2))).to.be.true;

		expect(nestup.beatLength).to.equal(4);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(0);
	});

	it("handles pure rest", () => {
		const input = `['4]`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const container = new Container(parseTree[0]);

		const onsets = container.normalizedOnsets();
		expect(onsets).to.have.length(1);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;

		expect(nestup.beatLength).to.equal(4);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(0);
	});

	it("handles the thing we made rests for", () => {
		const input = `['4] {10 6 []}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);

		expect(nestup.beatLength).to.equal(4);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(2);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(50);
		expect(midiLikeEvents[1].time).to.equal(60);
	});
});
