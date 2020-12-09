require("mocha");
const { expect } = require("chai");
const { Phrase, RhythmParser, Nestup } = require("../index");
const Fraction = require("fraction.js");

describe("Nestup", () => {

	it("generates ticked events", () => {
		const input = `[4] {1}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickedEvents = nestup.tickSnappedEvents(100);

		expect(tickedEvents).to.be.an.instanceOf(Array);
		expect(tickedEvents).to.have.length(1);
		expect(tickedEvents[0]).to.haveOwnProperty("time").that.is.a("number");
		expect(tickedEvents[0]).to.haveOwnProperty("isRest").that.is.a("boolean");
		expect(tickedEvents[0]).to.haveOwnProperty("path").that.is.a("string");
	});

	it("aligns events with a tick grid", () => {
		const input = `[4] {3}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const divisibleTickedEvents = nestup.tickSnappedEvents(300);
		const normalizedOnsets = nestup.normalizedOnsets();

		expect(divisibleTickedEvents).to.be.an.instanceOf(Array);
		expect(divisibleTickedEvents).to.have.length(3);
		expect(divisibleTickedEvents[0].isRest).to.equal(false);
		expect(divisibleTickedEvents[1].isRest).to.equal(false);
		expect(divisibleTickedEvents[2].isRest).to.equal(false);
		expect(divisibleTickedEvents[0].time).to.equal(0);
		expect(divisibleTickedEvents[1].time).to.equal(100);
		expect(divisibleTickedEvents[2].time).to.equal(200);
		expect(divisibleTickedEvents[0].path).to.equal(normalizedOnsets[0].path);
		expect(divisibleTickedEvents[1].path).to.equal(normalizedOnsets[1].path);
		expect(divisibleTickedEvents[2].path).to.equal(normalizedOnsets[2].path);
	});

	it("rounds event times to the nearest tick", () => {
		const input = `[4] {3}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickEvents = nestup.tickSnappedEvents(100);

		expect(tickEvents).to.be.an.instanceOf(Array);
		expect(tickEvents).to.have.length(3);
		expect(tickEvents[0].time).to.equal(0);
		expect(tickEvents[1].time).to.equal(33);
		expect(tickEvents[2].time).to.equal(67);
	});

	it("handles rests", () => {
		const input = `[4] {3 (2, 1) {0} }`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickEvents = nestup.tickSnappedEvents(100);

		expect(tickEvents).to.be.an.instanceOf(Array);
		expect(tickEvents).to.have.length(3);
		expect(tickEvents[0].isRest).to.equal(false);
		expect(tickEvents[1].isRest).to.equal(true);
		expect(tickEvents[2].isRest).to.equal(false);
	});

	it("generates midi-like events", () => {
		const input = `[4] {4 (3, 1) {0} }`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.asOnOffEvents(100);
		expect(midiLikeEvents).to.be.an.instanceOf(Array);
		expect(midiLikeEvents).to.have.length(6);

		expect(midiLikeEvents[0].on).to.equal(true);
		expect(midiLikeEvents[0].time).to.equal(0);
		expect(midiLikeEvents[1].on).to.equal(false);
		expect(midiLikeEvents[1].time).to.equal(25);
		expect(midiLikeEvents[2].on).to.equal(true);
		expect(midiLikeEvents[2].time).to.equal(25);
		expect(midiLikeEvents[3].on).to.equal(false);
		expect(midiLikeEvents[3].time).to.equal(50);
		expect(midiLikeEvents[4].on).to.equal(true);
		expect(midiLikeEvents[4].time).to.equal(75);
		expect(midiLikeEvents[5].on).to.equal(false);
		expect(midiLikeEvents[5].time).to.equal(100);
	});

	it("handles funky on/off overlap", () => {
		const input = `[4] {4
			(2, 3) {1}
			(3, 1) {0}
		}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.asOnOffEvents(100);
		expect(midiLikeEvents).to.be.an.instanceOf(Array);
		expect(midiLikeEvents).to.have.length(4);

		expect(midiLikeEvents[0].on).to.equal(true);
		expect(midiLikeEvents[0].time).to.equal(0);
		expect(midiLikeEvents[1].on).to.equal(false);
		expect(midiLikeEvents[1].time).to.equal(25);
		expect(midiLikeEvents[2].on).to.equal(true);
		expect(midiLikeEvents[2].time).to.equal(25);
		expect(midiLikeEvents[3].on).to.equal(false);
		expect(midiLikeEvents[3].time).to.equal(50);
	});
});
