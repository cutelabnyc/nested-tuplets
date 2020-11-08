require("mocha");
const { expect, assert } = require("chai");
const { RhythmParser, ParseError } = require("../index");

describe("Parse errors", () => {
	it("identifies obvious line errors", () => {
		const input = `{1} a`;
		const parser = new RhythmParser();

		try {
			const result = parser.parse(input);
			assert.fail("Should have thrown an error");
		} catch (e) {
			const pe = new ParseError(e);
			expect(pe.line).to.equal(1);
			expect(pe.col).to.equal(5);
			expect(pe.message).to.contain("Unexpected word token: \"a\".");
			expect(pe.token).to.equals("a");
		}
	});

	it("identifies lexer errors", () => {
		const input = `[2, 3 * 4] {5}`;
		const parser = new RhythmParser();

		try {
			const result = parser.parse(input);
			assert.fail("Should have thrown an error");
		} catch (e) {
			const pe = new ParseError(e);
			expect(pe.line).to.equal(1);
			expect(pe.col).to.equal(7);
			expect(pe.message).to.contain("Unexpected input (lexer error).");
			expect(pe.token).to.equals("*");
		}
	});
});
