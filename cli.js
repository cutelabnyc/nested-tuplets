const fs = require("fs");
const path = require("path");
const { Phrase, RhythmParser, normalizedOnsets } = require("./index");
const writeOnsetsAsMidi = require("./src/trackWriter");
const { program } = require('commander');
program.version('0.1.0');

program
	.requiredOption('-i, --input <input>', 'input rhythm file (required)')
	.option('-w, --watch <destination>', 'output directory for watch mode')
	.parse(process.argv);

function process(text, outputFilePath) {
	const parser = new RhythmParser();
	const parseTree = parser.parse(text);
	const phrases = parseTree.map(p => new Phrase(p));
	const onsets = normalizedOnsets(phrases);
	writeOnsetsAsMidi(onsets, outputFilePath);
}

function makeOutName(container, prefix) {
	if (container) {
		const outName = `out-${Date.now()}`;
		return path.join(container, outName);
	} else {
		return prefix;
	}
}

let outName = makeOutName(program.watch, program.args[0]);
let lastModTime = fs.statSync(program.input).mtime;

// Process straight through
console.log(program.input);
fs.readFile(program.input, { encoding: "utf8" }, (err, contents) => {
	if (err) throw err;
	process(contents, outName);
});

// Watch mode
if (program.watch) {
	let location = path.dirname(program.input);
	console.log(`Watching ${program.input} for file changes`);
	fs.watch(
		program.input,
		{ persistent: true, encoding: "utf8" },
		(eventType, filename) => {
			if (eventType === "change") {
				const inpath = path.join(location, filename);
				const nmodtime = fs.statSync(inpath).mtime;
				if (nmodtime.getTime() !== lastModTime.getTime()) {
					lastModTime = nmodtime;
					outName = makeOutName(program.watch, program.args[0]);
					console.log(`Change detected, writing to ${outName}`);
					fs.readFile(path.join(location, filename), { encoding: "utf8" }, (err, contents) => {
						if (err) throw err;
						try {
							process(contents, outName);
						} catch (e) {
							console.error(e);
						}
					});
				}
			}
		}
	)
}
