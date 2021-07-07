require("mocha");
const { expect } = require("chai");
const { default: Fraction } = require("fraction.js");
const { RhythmParser, Nestup, Onset } = require("../index");

describe("Nestup", () => {

	it("finds the correct proportionality", () => {
		const input = `[4] {1}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		expect(nestup.beatLength).to.equal(4);
	});

	it("finds the correct proportionality for a more complex expression", () => {
		const input = `[4] {1} [,1/2] [ [] [] ]`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		expect(nestup.beatLength).to.equal(6.5);
	});

	it("generates events", () => {
		const input = `[4] {1}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickedEvents = nestup.onOffEvents();

		expect(tickedEvents).to.be.an.instanceOf(Array);
		expect(tickedEvents).to.have.length(2);
		expect(tickedEvents[0]).to.haveOwnProperty("time").that.is.a("number");
		expect(tickedEvents[0]).to.haveOwnProperty("on").that.is.a("boolean");
		expect(tickedEvents[0]).to.haveOwnProperty("path").that.is.a("string");
	});

	it("aligns events with a tick grid", () => {
		const input = `[4] {3}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const divisibleTickedEvents = nestup.onOffEvents(300);
		const onsets = nestup._normalizedOnsets();

		expect(divisibleTickedEvents).to.be.an.instanceOf(Array);
		expect(divisibleTickedEvents).to.have.length(6);
		expect(divisibleTickedEvents[0].on).to.equal(true);
		expect(divisibleTickedEvents[0].time).to.equal(0);
		expect(divisibleTickedEvents[0].path).to.equal(onsets[0].path);
		expect(divisibleTickedEvents[1].on).to.equal(false);
		expect(divisibleTickedEvents[1].time).to.equal(100);
		expect(divisibleTickedEvents[1].path).to.equal(onsets[0].path);
		expect(divisibleTickedEvents[2].on).to.equal(true);
		expect(divisibleTickedEvents[2].time).to.equal(100);
		expect(divisibleTickedEvents[2].path).to.equal(onsets[1].path);
		expect(divisibleTickedEvents[3].on).to.equal(false);
		expect(divisibleTickedEvents[3].time).to.equal(200);
		expect(divisibleTickedEvents[3].path).to.equal(onsets[1].path);
		expect(divisibleTickedEvents[4].on).to.equal(true);
		expect(divisibleTickedEvents[4].time).to.equal(200);
		expect(divisibleTickedEvents[4].path).to.equal(onsets[2].path);
		expect(divisibleTickedEvents[5].on).to.equal(false);
		expect(divisibleTickedEvents[5].time).to.equal(300);
		expect(divisibleTickedEvents[5].path).to.equal(onsets[2].path);
	});

	it("rounds event times to the nearest tick", () => {
		const input = `[4] {3}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickedEvents = nestup.onOffEvents(100);

		expect(tickedEvents).to.be.an.instanceOf(Array);
		expect(tickedEvents).to.have.length(6);
		expect(tickedEvents[0].time).to.equal(0);
		expect(tickedEvents[1].time).to.equal(33);
		expect(tickedEvents[2].time).to.equal(33);
		expect(tickedEvents[3].time).to.equal(67);
		expect(tickedEvents[4].time).to.equal(67);
		expect(tickedEvents[5].time).to.equal(100);
	});

	it("handles rests", () => {
		const input = `[4] {3 2:1 {0} }`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const tickEvents = nestup.onOffEvents(30);

		expect(tickEvents).to.be.an.instanceOf(Array);
		expect(tickEvents).to.have.length(4);
		expect(tickEvents[0].on).to.equal(true);
		expect(tickEvents[1].on).to.equal(false);
		expect(tickEvents[1].time).to.equal(10);
		expect(tickEvents[2].on).to.equal(true);
		expect(tickEvents[2].time).to.equal(20);
		expect(tickEvents[3].on).to.equal(false);
		expect(tickEvents[3].time).to.equal(30);
	});

	it("generates midi-like events", () => {
		const input = `[4] {4 3:1 {0} }`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);
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
			2:3 {1}
			3 {0}
		}`;
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const midiLikeEvents = nestup.onOffEvents(100);
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

	it("handles a flexible container inside a fixed container", () => {
		const input = `[2
			[ [4] [] ]
		]
		`;

		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);
		const onsets = nestup._normalizedOnsets();

		expect(onsets).to.be.an.instanceOf(Array).with.length(3);
		expect(onsets[0].type).to.equal(Onset.type.ON);
		expect(onsets[1].type).to.equal(Onset.type.ON);
		expect(onsets[2].type).to.equal(Onset.type.OFF);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(4, 5))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(1))).to.be.true;

		const midiLikeEvents = nestup.onOffEvents(100);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(4);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[2].on).to.be.true;
		expect(midiLikeEvents[3].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(0);
		expect(midiLikeEvents[1].time).to.equal(80);
		expect(midiLikeEvents[2].time).to.equal(80);
		expect(midiLikeEvents[3].time).to.equal(100);
	});

	it("handles quick ranges", () => {
		const input = `['4] {10
			1
			4
			6:2
		}
		`;

		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const midiLikeEvents = nestup.onOffEvents(100);
		expect(midiLikeEvents).to.be.an.instanceOf(Array).with.length(6);
		expect(midiLikeEvents[0].on).to.be.true;
		expect(midiLikeEvents[1].on).to.be.false;
		expect(midiLikeEvents[2].on).to.be.true;
		expect(midiLikeEvents[3].on).to.be.false;
		expect(midiLikeEvents[4].on).to.be.true;
		expect(midiLikeEvents[5].on).to.be.false;
		expect(midiLikeEvents[0].time).to.equal(0);
		expect(midiLikeEvents[1].time).to.equal(10);
		expect(midiLikeEvents[2].time).to.equal(30);
		expect(midiLikeEvents[3].time).to.equal(40);
		expect(midiLikeEvents[4].time).to.equal(50);
		expect(midiLikeEvents[5].time).to.equal(70);
	});

	it("rejects a container that is both a parent as well as subdivided", () => {
		const input = `
			[ [] [] ] {2}
		`

		try {
			const parseTree = new RhythmParser().parse(input);
			const nestup = new Nestup(parseTree);
			expect.fail("Should have produced a parse error");
		} catch (e) {}
	});

	it("rejects a list of two or more subcontainers without explicit containers", () => {
		const input = `
			[ {2} {2} ]
		`

		try {
			const parseTree = new RhythmParser().parse(input);
			const nestup = new Nestup(parseTree);
			expect.fail("Should have produced a parse error");
		} catch (e) {}
	});

	it("parses a slightly complex expression", () => {
		const input = `
			[8] {8
				2:3 {6
					3 [']
				}
				5 [']
				7 {4}
			}
		`

		try {
			const parseTree = new RhythmParser().parse(input);
			const nestup = new Nestup(parseTree);
			expect(nestup).not.to.be.undefined();
		} catch (e) {}
	});

	it("parses a repeated container", () => {
		const input = `
			[3] : 3

		`
		const parseTree = new RhythmParser().parse(input);
		const nestup = new Nestup(parseTree);

		const divisibleTickedEvents = nestup.onOffEvents(30);

		expect(divisibleTickedEvents).to.be.an.instanceOf(Array);
		expect(divisibleTickedEvents).to.have.length(6);
		expect(divisibleTickedEvents[0].on).to.equal(true);
		expect(divisibleTickedEvents[0].time).to.equal(0);
		expect(divisibleTickedEvents[1].on).to.equal(false);
		expect(divisibleTickedEvents[1].time).to.equal(10);
		expect(divisibleTickedEvents[2].on).to.equal(true);
		expect(divisibleTickedEvents[2].time).to.equal(10);
		expect(divisibleTickedEvents[3].on).to.equal(false);
		expect(divisibleTickedEvents[3].time).to.equal(20);
		expect(divisibleTickedEvents[4].on).to.equal(true);
		expect(divisibleTickedEvents[4].time).to.equal(20);
		expect(divisibleTickedEvents[5].on).to.equal(false);
		expect(divisibleTickedEvents[5].time).to.equal(30);

	});

});
