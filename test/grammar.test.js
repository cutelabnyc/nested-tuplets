require("mocha");
const { expect } = require("chai");
const { RhythmParser } = require("../index");

describe("Bare minimum", () => {
	it("loads the grammar", () => {
		expect(RhythmParser).not.to.be.undefined;
	});
});

describe("Generating parse trees", () => {
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

		const phrase = result[0];

		expect(phrase).to.haveOwnProperty("dimension");
		expect(phrase).to.haveOwnProperty("structure");

		const dimension = phrase.dimension;

		expect(dimension).to.have.property("length").that.is.a("number");
		expect(dimension).to.have.property("beatRatio").that.is.a("number");

		const structure = phrase.structure;

		expect(structure).to.have.property("division").that.is.a("number");
		expect(structure).to.have.property("subtuplets").that.is.an.instanceOf(Array);
		expect(structure.division).to.equal(3);
		expect(structure.subtuplets).to.have.length(0);
	});

	it("parses a nested rhythm", () => {
		const input = `
			{3 (1, 2) {3}}
		`;
		const parser = new RhythmParser();
		const result = parser.parse(input);

		const phrase = result[0];

		expect(phrase).to.haveOwnProperty("structure");

		const structure = phrase.structure;

		expect(structure).to.have.property("division").that.equals(3);
		expect(structure).to.have.property("subtuplets").that.is.an.instanceOf(Array).that.has.length(1);

		const subtuplet = structure.subtuplets[0];

		expect(subtuplet).to.have.property("extension").that.is.a("object");
		expect(subtuplet).to.have.property("structure").that.is.a("object");

		const extension = subtuplet.extension;
		const substructure = subtuplet.structure;

		expect(extension).to.have.property("index").that.equals(1);
		expect(extension).to.have.property("length").that.equals(2);
		expect(substructure).to.have.property("division").that.equals(3);
	});

	it("parses a rhythm with phrase dimensions", () => {
		const input = `
			[4, 2] {3}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		const phrase = result[0];
		expect(phrase).to.haveOwnProperty("dimension");
		expect(phrase.dimension).to.have.property("length").that.equals(4);
		expect(phrase.dimension).to.have.property("beatRatio").that.equals(2);
	});

	it("parses a rhythm with multiple phrases", () => {
		const input = `
			{3} {4}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(2);
		expect(result[0]).to.have.property("structure").with.property("division").that.equals(3);
		expect(result[1]).to.have.property("structure").with.property("division").that.equals(4);
	});

	it("parses a rhythm with a beat ratio", () => {
		const input = `
			[2, 2/3] {3}
		`;

		const parser = new RhythmParser();
		const result = parser.parse(input);

		expect(result).to.have.length(1);
		const phrase = result[0];
		expect(phrase).to.haveOwnProperty("dimension");
		expect(phrase.dimension).to.have.property("length").that.equals(2);
		expect(phrase.dimension).to.have.property("beatRatio").that.equals(2/3);
	})
});
