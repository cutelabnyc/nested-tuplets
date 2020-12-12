require("mocha");
const { expect } = require("chai");
const { RhythmParser, Container, Onset } = require("../index");
const Fraction = require("fraction.js");

describe("Subdivided Containers", () => {
	it("parses a basic tuplet", () => {
		const input = `{3}`;
		const parseTree = new RhythmParser().parse(input);

		const containerDescription = parseTree[0];
		const tup = new Container(containerDescription);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(4);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 3))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(2, 3))).to.be.true;
		expect(onsets[3].time.equals(new Fraction(1))).to.be.true;
	});

	it("parses a nested tuplet", () => {
		const input = `{3
			(1, 1) {3}
		}`;
		const parseTree = new RhythmParser().parse(input);

		const containerDescription = parseTree[0];
		const tup = new Container(containerDescription);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(6);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 9))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(2, 9))).to.be.true;
		expect(onsets[3].time.equals(new Fraction(1, 3))).to.be.true;
		expect(onsets[4].time.equals(new Fraction(2, 3))).to.be.true;
		expect(onsets[5].time.equals(new Fraction(1))).to.be.true;
	});

	it("handles rests", () => {
		const input = `[4] {0}`;
		const parseTree = new RhythmParser().parse(input);

		const containerDescription = parseTree[0];
		const tup = new Container(containerDescription);
		const onsets = tup.normalizedOnsets();

		expect(onsets[0].type).to.equal(Onset.type.OFF);
	});

	it("handles subtuples with rests", () => {
		const input = `[4] {3 (2, 1) {0} }`;
		const parseTree = new RhythmParser().parse(input);

		const containerDescription = parseTree[0];
		const tup = new Container(containerDescription);
		const onsets = tup.normalizedOnsets();

		expect(onsets[1].type).to.equal(Onset.type.OFF);
	});

	it("handles overlapped rests", () => {
		const input = `[4] {3 (1, 3) {0} (2, 1) {1} }`;
		const parseTree = new RhythmParser().parse(input);

		const containerDescription = parseTree[0];
		const tup = new Container(containerDescription);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(4);
		expect(onsets[0].type).to.equal(Onset.type.OFF);
		expect(onsets[1].type).to.equal(Onset.type.ON);
		expect(onsets[2].type).to.equal(Onset.type.OFF);
		expect(onsets[3].type).to.equal(Onset.type.OFF);
	});
});
