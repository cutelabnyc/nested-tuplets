const maxApi = require("max-api");
const RhythmParser = require("./src/parser");
const Phrase = require("./src/phrase");
const ParseError = require("./src/parseError");
const { normalizedOnsets } = require("./src/util");

function process(text) {
	const parser = new RhythmParser();
	const results = parser.parse(text);
	const phrases = results.map((r, idx) => new Phrase(r, idx + 1));
	const onsets = normalizedOnsets(phrases);
	const beatLength = phrases.reduce((acc, ph) => acc + (ph.length * ph.beatRatio), 0);
	return { beatLength, onsets };
}

maxApi.addHandler("parse", (text) => {
	try {
		const { beatLength, onsets } = process(text);
		maxApi.outlet(["beatLength", beatLength]);
		const onsetsAsList = onsets.reduce((p, onset) => p.concat([onset.time, onset.path]), []);
		maxApi.outlet(["onsets"].concat(onsetsAsList));
	} catch (e) {
		const pe = new ParseError(e);
		if (pe.token) {
			const maxSanitizedToken = pe.token === "," ? "##comma##" : pe.token;
			maxApi.outlet(["parseerror", pe.line, pe.col, maxSanitizedToken, pe.message]);
		} else {
			maxApi.post(e.message);
			maxApi.outlet("error");
		}
	}
});
