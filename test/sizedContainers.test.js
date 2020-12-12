require("mocha");
const { expect } = require("chai");
const { Container, RhythmParser, Nestup } = require("../index");
const Fraction = require("fraction.js");

describe("Sized Containers", () => {
	it("parses a container with a beat ratio", () => {
		const input = `[2, 2/3] {3}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const container = new Container(parseTree[0]);

		expect(container).to.have.property("proportionality");
		expect(container.proportionality.equals(new Fraction(4, 3))).to.be.true;
		expect(container).to.have.property("scale");
		expect(container.scale.equals(new Fraction(2, 3))).to.be.true;

		const onsets = container.normalizedOnsets();
		expect(onsets).to.have.length(4);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 3))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(2, 3))).to.be.true;
		expect(onsets[3].time.equals(new Fraction(1))).to.be.true;
	});

	it("normalizes containers by beat ratio", () => {
		const input = `[1, 1/3] {2} [1] {2}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(2);

		const nestup = new Nestup(parseTree);
		const onsets = nestup._normalizedOnsets();

		expect(onsets).to.be.an.instanceOf(Array).with.length(5);
		expect(onsets[0].time.equals(new Fraction(0))).to.be.true;
		expect(onsets[1].time.equals(new Fraction(1, 8))).to.be.true;
		expect(onsets[2].time.equals(new Fraction(1, 4))).to.be.true;
		expect(onsets[3].time.equals(new Fraction(5, 8))).to.be.true;
		expect(onsets[4].time.equals(new Fraction(1))).to.be.true;
	});

	it("handles onset paths", () => {
		const input = `{2 (2, 1) {2 (2, 1) {2}}}`;
		const parseTree = new RhythmParser().parse(input);

		expect(parseTree).to.be.an.instanceOf(Array).with.length(1);

		const nestup = new Nestup(parseTree);
		const onsets = nestup._normalizedOnsets();

		expect(onsets).to.be.an.instanceOf(Array).with.length(5);
		expect(onsets[0].path).to.equal("11");
		expect(onsets[1].path).to.equal("111");
		expect(onsets[2].path).to.equal("1111");
		expect(onsets[3].path).to.equal("1111");
	});
});
