// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  ws: { match: /\s+/, lineBreaks: true },
  number: /[0-9]+/,
  word: /[a-z]+/,
  lp: /\(/,
  comma: /,/,
  rp: /\)/,
  lb: /\{/,
  rb: /\}/
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "tuple$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "tuple$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tuple$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "tuple$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tuple$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "tuple$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tuple", "symbols": ["tuple$ebnf$1", "extension", "tuple$ebnf$2", "structure", "tuple$ebnf$3"], "postprocess": d => {return { extension: d[1], structure: d[3] }}},
    {"name": "extension$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "extension$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "extension", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "extension$ebnf$1", "index", "extension$ebnf$2", (lexer.has("comma") ? {type: "comma"} : comma), "extension$ebnf$3", "length", "extension$ebnf$4", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": d => {return { index: d[2], length: d[6] }}},
    {"name": "structure$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure$ebnf$3", "symbols": []},
    {"name": "structure$ebnf$3", "symbols": ["structure$ebnf$3", "tuple"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "structure$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure$ebnf$5", "symbols": ["_"], "postprocess": id},
    {"name": "structure$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "structure", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "structure$ebnf$1", "division", "structure$ebnf$2", "structure$ebnf$3", "structure$ebnf$4", (lexer.has("rb") ? {type: "rb"} : rb), "structure$ebnf$5"], "postprocess": d => {return { division: d[2], subtuples: d[4] }}},
    {"name": "index", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseInt(d.join(""))},
    {"name": "length", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseInt(d.join(""))},
    {"name": "division", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => parseInt(d.join(""))},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": d => { return null; }}
]
  , ParserStart: "tuple"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
