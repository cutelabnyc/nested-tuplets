require("mocha");
const { expect } = require("chai");
const { RhythmParser, Tuplet } = require("../index");

describe("Tuplets", () => {
	it("parses a basic tuplet", () => {
		const input = `{3}`;
		const parseTree = new RhythmParser().parse(input);

		const phraseDescription = parseTree[0];
		const tup = new Tuplet(phraseDescription.structure);
		const onsets = tup.normalizedOnsets();

		expect(onsets).to.have.length(3);
		expect(onsets[0].time).to.equal(0);
		expect(onsets[1].time).to.be.within(0.33, 0.34);
		expect(onsets[2].time).to.be.within(0.66, 0.67);
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
		expect(onsets[0].time).to.equal(0);
		expect(onsets[1].time).to.be.within(0.33 / 3, 0.34 / 3);
		expect(onsets[2].time).to.be.within(0.66 / 3, 0.67 / 3);
		expect(onsets[3].time).to.be.within(0.33, 0.34);
		expect(onsets[4].time).to.be.within(0.66, 0.67);
	});
});
