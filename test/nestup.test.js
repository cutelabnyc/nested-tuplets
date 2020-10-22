require("mocha");
const { expect } = require("chai");
const grammar = require("../src/build/grammar");

describe("Bare minimum", () => {
	it("loads the grammar", () => {
		expect(grammar).not.to.be.undefined;
	});
});
