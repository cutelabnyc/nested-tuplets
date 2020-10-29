const maxApi = require("max-api");
const RhythmParser = require("./src/parser");
const Phrase = require("./src/phrase");
const ParseError = require("./src/parseError");
const { normalizedOnsetTimes } = require("./src/util");

function process(text) {
	const parser = new RhythmParser();
	const results = parser.parse(text);
	const phrases = results.map(r => new Phrase(r));
	const times = normalizedOnsetTimes(phrases);
	return times;
}

maxApi.addHandler("parse", (text) => {
	try {
		const times = process(text);
		maxApi.outlet(["times"].concat(times));
	} catch (e) {
		const pe = new ParseError(e);
		if (pe.token) {
			maxApi.outlet(["parseerror", pe.line, pe.col, pe.token, pe.message]);
		} else {
			maxApi.post(e.message);
			maxApi.outlet("error");
		}
	}
});
