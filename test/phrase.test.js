require("mocha");
const { expect } = require("chai");
const Phrase = require("../src/phrase");
const RhythmParser = require("../src/parser");
const { normalizedOnsets } = require("../src/util");

describe("Phrases", () => {
	it("parses a phrase with a beat ratio", () => {
		const input = `[2, 2/3] {3}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const phrase = new Phrase(parseTree[0]);

		expect(phrase).to.have.property("length").that.equals(2);
		expect(phrase).to.have.property("beatRatio").that.equals(2/3);

		const onsets = phrase.normalizedOnsets();
		expect(onsets).to.have.length(3);
		expect(onsets[0].time).to.equal(0);
		expect(onsets[1].time).to.equal(1/3);
		expect(onsets[2].time).to.equal(2/3);
	});

	it("normalizes phrases by beat ratio", () => {
		const input = `[1, 1/3] {2} [1] {2}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(2);

		const phrases = parseTree.map(p => new Phrase(p));
		const onsets = normalizedOnsets(phrases);

		expect(onsets).to.be.an.instanceOf(Array).with.length(4);
		expect(onsets[0].time).to.equal(0);
		expect(onsets[1].time).to.equal(0.5 / 4);
		expect(onsets[2].time).to.equal(1 / 4);
		expect(onsets[3].time).to.equal(2.5 / 4);
	});

	it("handles onset paths", () => {
		const input = `{2 (2, 1) {2 (2, 1) {2}}}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const phrases = parseTree.map((p, idx) => new Phrase(p, idx + 1));
		const onsets = normalizedOnsets(phrases);

		expect(onsets).to.be.an.instanceOf(Array).with.length(4);
		expect(onsets[0].path).to.equal("1");
		expect(onsets[1].path).to.equal("11");
		expect(onsets[2].path).to.equal("111");
		expect(onsets[3].path).to.equal("111");
	});
});
