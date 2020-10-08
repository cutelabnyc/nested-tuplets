const maxApi = require("max-api");
const RhythmParser = require("./src/parser");
const NestedTuplet = require("./src/nestedTuplet");

function process(text) {
	const parser = new RhythmParser();
	const results = parser.parse(text);
	const nt = new NestedTuplet(results);
	const times = nt.normalizedOnsetTimes();
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
