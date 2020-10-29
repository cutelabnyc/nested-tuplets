require("mocha");
const { expect } = require("chai");
const Phrase = require("../src/phrase");
const RhythmParser = require("../src/parser");
const { normalizedOnsetTimes } = require("../src/util");

describe("Phrases", () => {
	it("parses a phrase with a beat ratio", () => {
		const input = `[2, 2/3] {3}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const phrase = new Phrase(parseTree[0]);

		expect(phrase).to.have.property("length").that.equals(2);
		expect(phrase).to.have.property("beatRatio").that.equals(2/3);

		const onsets = phrase.normalizedOnsetTimes();
		expect(onsets).to.have.length(3);
		expect(onsets[0]).to.equal(0);
		expect(onsets[1]).to.equal(1/3);
		expect(onsets[2]).to.equal(2/3);
	});

	it("normalizes phrases by beat ratio", () => {
		const input = `[1, 1/3] {2} [1] {2}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(2);

		const phrases = parseTree.map(p => new Phrase(p));
		const times = normalizedOnsetTimes(phrases);

		expect(times).to.be.an.instanceOf(Array).with.length(4);
		expect(times[0]).to.equal(0);
		expect(times[1]).to.equal(0.5 / 4);
		expect(times[2]).to.equal(1 / 4);
		expect(times[3]).to.equal(2.5 / 4);
	});
});
