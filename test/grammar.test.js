require("mocha");
const { expect } = require("chai");
const { RhythmParser, ParseError } = require("../index");
const Fraction = require("fraction.js");

describe("Grammar: Bare minimum", () => {
	it("loads the grammar", () => {
		expect(RhythmParser).not.to.be.undefined;
	});
});

describe("Grammar: Generating parse trees", () => {
	it("parses an empty string", () => {
		const input = "";
		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.be.an.instanceOf(Array);
		expect(result).to.have.length(0);
	});

	it("parses a simple rhythm", () => {
		const input = `
			{3}
		`;
		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.be.an.instanceOf(Array);
		expect(result).to.have.length(1);

		const container = result[0];

		expect(container).to.haveOwnProperty("dimension");
		expect(container).to.haveOwnProperty("subdivisions");
		expect(container.dimension).to.equal(undefined);

		const subdivisions = container.subdivisions;

		expect(subdivisions).to.have.property("division").that.is.a("number");
		expect(subdivisions).to.have.property("ranges").that.is.null;
	});

	it("parses a nested rhythm", () => {
		const input = `
			{3 (1, 2) {3}}
		`;
		const parser = new RhythmParser();
		const result = parser.parse(input);

		const container = result[0];

		expect(container).to.haveOwnProperty("subdivisions");

		const subdivisions = container.subdivisions;

		expect(subdivisions).to.have.property("division").that.equals(3);
		expect(subdivisions).to.have.property("ranges").that.is.an.instanceOf(Array).that.has.length(1);

		const rangedContainer = subdivisions.ranges[0];

		expect(rangedContainer).to.have.property("range").that.is.a("object");
		expect(rangedContainer).to.have.property("container").that.is.a("object");

		const range = rangedContainer.range;
		const subcontainer = rangedContainer.container;

		expect(range).to.have.property("index").that.equals(1);
		expect(range).to.have.property("length").that.equals(2);
		expect(subcontainer).to.have.property("subdivisions").that.is.a("object");
		expect(subcontainer.subdivisions.division).to.equal(3);
	});

	it("handles multiple ranged containers", () => {
		const input = `
			{2
				(1) {3}
				(2) {4}
			}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		const container = result[0];
		expect(container).to.haveOwnProperty("subdivisions");
		expect(container.subdivisions).to.have.property("division").that.equals(2);
		expect(container.subdivisions).to.haveOwnProperty("ranges").with.length(2);
		expect(container.subdivisions.ranges[0].container.subdivisions.division).to.equal(3);
		expect(container.subdivisions.ranges[1].container.subdivisions.division).to.equal(4);
	});

	it("parses a rhythm with container dimensions", () => {
		const input = `
			[4, 2] {3}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		const container = result[0];
		expect(container).to.haveOwnProperty("dimension");
		expect(container.dimension).to.have.property("proportionality").that.equals(4);
		expect(container.dimension).to.have.property("scale").that.is.an.instanceOf(Fraction);
		expect(container.dimension.scale.equals(2)).to.be.true;
		expect(container).to.haveOwnProperty("subdivisions");
		expect(container.subdivisions).to.have.property("division").that.equals(3);
	});

	it("parses a rhythm with multiple containers", () => {
		const input = `
			[]{3} []{4}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(2);
		expect(result[0]).to.have.property("subdivisions").with.property("division").that.equals(3);
		expect(result[1]).to.have.property("subdivisions").with.property("division").that.equals(4);
	});

	it("parses a rhythm with a rational scale", () => {
		const input = `
			[2, 2/3] {3}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const container = result[0];
		expect(container).to.haveOwnProperty("dimension");
		expect(container.dimension).to.have.property("proportionality").that.equals(2);
		expect(container.dimension).to.have.property("scale").that.is.an.instanceOf(Fraction);
		expect(container.dimension.scale.equals(new Fraction(2, 3))).to.be.true;
	});

	it("handles subcontainers", () => {
		const input = `[[1] [1]]`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const container = result[0];
		expect(container).to.haveOwnProperty("contents").that.is.an.instanceOf(Array).with.length(2);
	});

	it("handles a container with additive proportionality", () => {
		const input = `
			[+ [1] [1]]
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const container = result[0];
		expect(container).to.haveOwnProperty("dimension");
		expect(container.dimension).to.have.property("proportionality").that.equals("+");
	});

	it("handles ties between containers", () => {
		const input = `
			[[1] _ [1]]
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const container = result[0];
		expect(container).to.haveOwnProperty("contents").that.is.an.instanceOf(Array).with.length(2);
		expect(container.contents[0]).to.haveOwnProperty("tie").that.equals(true);
	});

	it("handles ties between ranged containers", () => {
		const input = `
			[] {3
				(1) [] _
				(1) []
			}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const container = result[0];
		expect(container).to.haveOwnProperty("subdivisions");
		expect(container.subdivisions).to.haveOwnProperty("ranges").that.is.an.instanceOf(Array).with.length(2);
		expect(container.subdivisions.ranges[0].container).to.haveOwnProperty("tie").that.equals(true);
	});

	it("rejects ties at the beginning or end of a list of containers", () => {
		try {
			const input = `_[1]`
			const parser = new RhythmParser();
			parser.parse(input);
			expect.fail("Should have thrown a parse error");
		} catch (e) {}

		try {
			const input = `[1]_`
			const parser = new RhythmParser();
			parser.parse(input);
			expect.fail("Should have thrown a parse error");
		} catch (e) {}
	});
});
