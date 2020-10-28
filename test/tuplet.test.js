require("mocha");
const { expect } = require("chai");
const Tuplet = require("../src/tuplet");
const RhythmParser = require("../src/parser");

describe("Tuplets", () => {
	it("parses a basic tuplet", () => {
		const input = `{3}`;
		const parseTree = new RhythmParser().parse(input);

		const phraseDescription = parseTree[0];
		const tup = new Tuplet(phraseDescription.structure);
		const times = tup.normalizedOnsetTimes();

		expect(times).to.have.length(3);
		expect(times[0]).to.equal(0);
		expect(times[1]).to.be.within(0.33, 0.34);
		expect(times[2]).to.be.within(0.66, 0.67);
	});

	it("parses a nested tuple", () => {
		const input = `{3
			(1, 1) {3}
		}`;
		const parseTree = new RhythmParser().parse(input);

		const phraseDescription = parseTree[0];
		const tup = new Tuplet(phraseDescription.structure);
		const times = tup.normalizedOnsetTimes();

		expect(times).to.have.length(5);
		expect(times[0]).to.equal(0);
		expect(times[1]).to.be.within(0.33 / 3, 0.34 / 3);
		expect(times[2]).to.be.within(0.66 / 3, 0.67 / 3);
		expect(times[3]).to.be.within(0.33, 0.34);
		expect(times[4]).to.be.within(0.66, 0.67);
	});
});
