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
  plus: /\+/,
  underscore: /_/
});


const Fraction = require("fraction.js");


// Beat ratio
const dbr = new Fraction(1);
// Container size
const dpd = { length: 4, beatRatio: dbr };
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "nestup$ebnf$1", "symbols": []},
    {"name": "nestup$ebnf$1", "symbols": ["nestup$ebnf$1", "_"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nestup", "symbols": ["nestup$ebnf$1"], "postprocess": d => []},
    {"name": "nestup$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "nestup$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nestup", "symbols": ["container_list_or_subdivisions", "nestup$ebnf$2"], "postprocess": d => d[0]},
    {"name": "container_list_or_subdivisions$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "container_list_or_subdivisions$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "container_list_or_subdivisions", "symbols": ["container_list_or_subdivisions$ebnf$1", "subdivisions"], "postprocess": d => { return [{ dimension: undefined, subdivisions: d[1] }] }},
    {"name": "container_list_or_subdivisions", "symbols": ["container_list"], "postprocess": d => d[0]},
    {"name": "container_list", "symbols": ["container"]},
    {"name": "container_list", "symbols": ["container", "container_list"], "postprocess": d => { return [d[0]].concat(d[1]) }},
    {"name": "container_list$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "container_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "container_list", "symbols": ["container", "container_list$ebnf$1", (lexer.has("underscore") ? {type: "underscore"} : underscore), "container_list"], "postprocess": d => { d[0].tie = true; return [d[0]].concat(d[3]); }},
    {"name": "container$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "container$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "container", "symbols": ["container$ebnf$1", "sized_container"], "postprocess": d => d[1]},
    {"name": "container$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "container$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "container", "symbols": ["container$ebnf$2", "unsized_container"], "postprocess": d => d[1]},
    {"name": "sized_container", "symbols": ["sized_contents_with_subcontainers"], "postprocess": d => d[0]},
    {"name": "sized_container$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "sized_container$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_container", "symbols": ["sized_contents", "sized_container$ebnf$1", "subdivisions"], "postprocess": d => { return { dimension: d[0].dimension, subdivisions: d[2] }}},
    {"name": "unsized_container", "symbols": ["unsized_contents_with_subcontainers"], "postprocess": d => d[0]},
    {"name": "unsized_container$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "unsized_container$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsized_container", "symbols": ["unsized_contents", "unsized_container$ebnf$1", "subdivisions"], "postprocess": d => { return { dimension: d[0].dimension, subdivisions: d[2] }}},
    {"name": "unsized_container", "symbols": ["unsized_contents"], "postprocess": d => { return { dimension: undefined }}},
    {"name": "sized_contents$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "sized_contents$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_contents$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "sized_contents$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_contents", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "sized_contents$ebnf$1", "dimension", "sized_contents$ebnf$2", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { dimension: d[2] }}},
    {"name": "sized_contents_with_subcontainers$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "sized_contents_with_subcontainers$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_contents_with_subcontainers$ebnf$2", "symbols": ["container_list_or_subdivisions"], "postprocess": id},
    {"name": "sized_contents_with_subcontainers$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_contents_with_subcontainers$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "sized_contents_with_subcontainers$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "sized_contents_with_subcontainers", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "sized_contents_with_subcontainers$ebnf$1", "dimension", "sized_contents_with_subcontainers$ebnf$2", "sized_contents_with_subcontainers$ebnf$3", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { dimension: d[2], contents: d[3] }}},
    {"name": "unsized_contents$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "unsized_contents$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsized_contents", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "unsized_contents$ebnf$1", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { dimension: undefined }}},
    {"name": "unsized_contents_with_subcontainers$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "unsized_contents_with_subcontainers$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsized_contents_with_subcontainers", "symbols": [(lexer.has("ls") ? {type: "ls"} : ls), "container_list_or_subdivisions", "unsized_contents_with_subcontainers$ebnf$1", (lexer.has("rs") ? {type: "rs"} : rs)], "postprocess": d => { return { dimension: undefined, contents: d[1] }}},
    {"name": "dimension", "symbols": ["integer"], "postprocess": d => { return { proportionality: d[0], scale: new Fraction(1) }}},
    {"name": "dimension$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "dimension$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dimension", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "dimension$ebnf$1", "ratio"], "postprocess": d => { return { proportionality: 1, scale: d[2] }}},
    {"name": "dimension$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "dimension$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dimension$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "dimension$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dimension", "symbols": ["integer", "dimension$ebnf$2", (lexer.has("comma") ? {type: "comma"} : comma), "dimension$ebnf$3", "ratio"], "postprocess": d => { return { proportionality: d[0], scale: d[4] }}},
    {"name": "dimension", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus)], "postprocess": d => { return { proportionality: "+", scale: 1 }}},
    {"name": "dimension$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "dimension$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dimension$ebnf$5", "symbols": ["_"], "postprocess": id},
    {"name": "dimension$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dimension", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus), "dimension$ebnf$4", (lexer.has("comma") ? {type: "comma"} : comma), "dimension$ebnf$5", "ratio"], "postprocess": d => { return { proportionality: "+", scale: d[4] }}},
    {"name": "subdivisions$ebnf$1", "symbols": ["ranged_container_list"], "postprocess": id},
    {"name": "subdivisions$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "subdivisions$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "subdivisions$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "subdivisions", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "subdivisions$ebnf$1", "subdivisions$ebnf$2", (lexer.has("rb") ? {type: "rb"} : rb)], "postprocess": d => {return { division: 1, ranges: d[1] }}},
    {"name": "subdivisions$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "subdivisions$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "subdivisions$ebnf$4", "symbols": ["ranged_container_list"], "postprocess": id},
    {"name": "subdivisions$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "subdivisions$ebnf$5", "symbols": ["_"], "postprocess": id},
    {"name": "subdivisions$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "subdivisions", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "subdivisions$ebnf$3", "integer", "subdivisions$ebnf$4", "subdivisions$ebnf$5", (lexer.has("rb") ? {type: "rb"} : rb)], "postprocess": d => {return { division: d[2], ranges: d[3] }}},
    {"name": "ranged_container_list", "symbols": ["ranged_container"], "postprocess": d => [d[0]]},
    {"name": "ranged_container_list", "symbols": ["ranged_container", "ranged_container_list"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "ranged_container_list$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "ranged_container_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ranged_container_list", "symbols": ["ranged_container", "ranged_container_list$ebnf$1", (lexer.has("underscore") ? {type: "underscore"} : underscore), "ranged_container_list"], "postprocess": d => { d[0].tie = true; return [d[0]].concat(d[3]); }},
    {"name": "ranged_container$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "ranged_container$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ranged_container$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "ranged_container$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ranged_container", "symbols": ["ranged_container$ebnf$1", "range", "ranged_container$ebnf$2", "unsized_container"], "postprocess": d => {return { range: d[1], container: d[3] }}},
    {"name": "ranged_container$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "ranged_container$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ranged_container$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "ranged_container$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ranged_container", "symbols": ["ranged_container$ebnf$3", "range", "ranged_container$ebnf$4", "subdivisions"], "postprocess": d => {return { range: d[1], container: { dimension: undefined, subdivisions: d[3] } }}},
    {"name": "range$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "range$ebnf$1", "integer", "range$ebnf$2", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": d => {return { index: d[2], length: 1 }}},
    {"name": "range$ebnf$3", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range$ebnf$4", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range$ebnf$5", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range$ebnf$6", "symbols": ["_"], "postprocess": id},
    {"name": "range$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "range", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "range$ebnf$3", "integer", "range$ebnf$4", (lexer.has("comma") ? {type: "comma"} : comma), "range$ebnf$5", "integer", "range$ebnf$6", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": d => {return { index: d[2], length: d[6] }}},
    {"name": "ratio", "symbols": ["integer"], "postprocess": d => new Fraction(d[0])},
    {"name": "ratio$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "ratio$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ratio$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "ratio$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ratio", "symbols": ["integer", "ratio$ebnf$1", (lexer.has("slash") ? {type: "slash"} : slash), "ratio$ebnf$2", "integer"], "postprocess": d => new Fraction(d[0], d[4])},
    {"name": "integer", "symbols": [(lexer.has("unsigned_integer_tk") ? {type: "unsigned_integer_tk"} : unsigned_integer_tk)], "postprocess": d => parseInt(d.join(""))},
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
