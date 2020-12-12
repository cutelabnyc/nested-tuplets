const nearley = require("nearley");
const grammar = require("./build/grammar.js");

module.exports = class RhythmParser {
	constructor() {
		this._parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	}

	parse(text) {
		this._parser.feed(text);

		// First result, just in case the grammar is ambiguous, which it shouldn't be
		return this._parser.results[0];
	}
}
