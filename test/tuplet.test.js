require("mocha");
const { expect } = require("chai");
const { RhythmParser, Tuplet } = require("../index");
const Fraction = require("fraction.js");

describe("Tuplets", () => {
	it("parses a basic tuplet", () => {
		const input = `{3}`;
		const parseTree = new RhythmParser().parse(input);

		const phraseDescription = parseTree[0];
		const tup = new Tuplet(phraseDescription.structure);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(3);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 3))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(2, 3))).to.be.true;
	});

	it("parses a nested tuple", () => {
		const input = `{3
			(1, 1) {3}
		}`;
		const parseTree = new RhythmParser().parse(input);

		const phraseDescription = parseTree[0];
		const tup = new Tuplet(phraseDescription.structure);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(5);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 9))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(2, 9))).to.be.true;
		expect(onsets[3].time.equals(new Fraction(1, 3))).to.be.true;
		expect(onsets[4].time.equals(new Fraction(2, 3))).to.be.true;
	});
});
