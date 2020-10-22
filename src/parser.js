const nearley = require("nearley");
const grammar = require("./build/grammar.js");

module.exports = class RhythmParser {
	constructor() {
		this._parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), { keepHistory: true});
	}

	parse(text) {
		this._parser.feed(text);

		// Apparently our grammar is ambiguous. I have no idea why, and all of the parsings are the same.
		// I'm assuming it has something to do with whitespace. In any case, rather than get a phd in
		// computational linguistics, I'm just gonna take the first one. If you want to fight about
		// it you know where to find me.
		return this._parser.results[0];
	}
}
