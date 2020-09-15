const nearley = require("nearley");
const grammar = require("./build/grammar.js");
const fs = require("fs");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
const testRhythm = fs.readFileSync("inputs/nested.rhy", "utf8");
parser.feed(testRhythm);

// parser.results is an array of possible parsings.
console.log(parser.results[0]);
fs.writeFileSync("out.json", JSON.stringify(parser.results[0], null, 2));
