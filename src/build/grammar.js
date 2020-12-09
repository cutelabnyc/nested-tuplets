// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  ws: { match: /\s+/, lineBreaks: true },
  unsigned_integer_tk: /[0-9]+/,
  word: /[a-z]+/,
  lp: /\(/,
  comma: /,/,
  rp: /\)/,
  lb: /\{/,
  rb: /\}/,
	ls: /\[/,
	rs: /\]/,
	slash: /\//,
});


const Fraction = require("fraction.js");


// Beat ratio
const dbr = new Fraction(1);
// Phrase dimension
const dpd = { length: 4, beatRatio: dbr };
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "nestup$ebnf$1", "symbols": []},
    {"name": "nestup$ebnf$1", "symbols": ["nestup$ebnf$1", "phrase"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nestup$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "nestup$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nestup", "symbols": ["nestup$ebnf$1", "nestup$ebnf$2"], "postprocess": d => (d[0] ? d[0] : [])},
    {"name": "phrase$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "phrase$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase", "symbols": ["phrase$ebnf$1", "structure"], "postprocess": d => { return { dimension: dpd, structure: d[1] }}},
    {"name": "phrase$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "phrase$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "phrase$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase", "symbols": ["phrase$ebnf$2", "phrase_dimension", "phrase$ebnf$3", "structure"], "postprocess": d => { return { dimension: d[1], structure: d[3] }}},
    {"name": "phrase_dimension$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "phrase_dimension$ebnf$1", "number", "phrase_dimension$ebnf$2", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { length: d[2], beatRatio: dbr }}},
    {"name": "phrase_dimension$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$5", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$6", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "phrase_dimension$ebnf$3", "number", "phrase_dimension$ebnf$4", (lexer.has("comma") ? {type: "comma"} : comma), "phrase_dimension$ebnf$5", "number", "phrase_dimension$ebnf$6", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { length: d[2], beatRatio: new Fraction(d[6]) }}},
    {"name": "phrase_dimension$ebnf$7", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$7", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$8", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$8", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$9", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$9", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$10", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$10", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$11", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$11", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension$ebnf$12", "symbols": ["_"], "postprocess": id},
    {"name": "phrase_dimension$ebnf$12", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "phrase_dimension", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "phrase_dimension$ebnf$7", "number", "phrase_dimension$ebnf$8", (lexer.has("comma") ? {type: "comma"} : comma), "phrase_dimension$ebnf$9", "number", "phrase_dimension$ebnf$10", (lexer.has("slash") ? {type: "slash"} : slash), "phrase_dimension$ebnf$11", "number", "phrase_dimension$ebnf$12", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { length: d[2], beatRatio: new Fraction(d[6], d[10]) }}},
    {"name": "structure$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure$ebnf$2", "symbols": []},
    {"name": "structure$ebnf$2", "symbols": ["structure$ebnf$2", "tuplet"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "structure$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "structure$ebnf$1", "number", "structure$ebnf$2", "structure$ebnf$3", (lexer.has("rb") ? {type: "rb"} : rb)], "postprocess": d => {return { division: d[2], subtuplets: d[3] }}},
    {"name": "tuplet$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "tuplet$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tuplet$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "tuplet$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tuplet", "symbols": ["tuplet$ebnf$1", "extension", "tuplet$ebnf$2", "structure"], "postprocess": d => {return { extension: d[1], structure: d[3] }}},
    {"name": "extension$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "extension$ebnf$1", "number", "extension$ebnf$2", (lexer.has("comma") ? {type: "comma"} : comma), "extension$ebnf$3", "number", "extension$ebnf$4", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": d => {return { index: d[2], length: d[6] }}},
    {"name": "number", "symbols": [(lexer.has("unsigned_integer_tk") ? {type: "unsigned_integer_tk"} : unsigned_integer_tk)], "postprocess": d => parseInt(d.join(""))},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": d => { return null; }}
]
  , ParserStart: "nestup"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
