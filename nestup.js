const maxApi = require("max-api");
const RhythmParser = require("./src/parser");
const Phrase = require("./src/phrase");

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
		maxApi.post(e.message);
		maxApi.outlet("error");
	}
});
