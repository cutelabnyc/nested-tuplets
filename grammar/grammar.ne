# Add the moo lexer
@{%
const moo = require("moo");

const lexer = moo.compile({
  ws: { match: /\s+/, lineBreaks: true },
  unsigned_integer_tk: /[0-9]+/,
  word: /[a-z]+/,
  lp: /\(/,
  comma: /,/,
  rp: /\)/,
  lb: /\{/,
  rb: /\}/
	ls: /\[/,
	rs: /\]/,
});
%}

# Default structures
{%
// Beat ratio
const dbr = 1;
// Phrase dimension
const dpd = { length: 1, beatRatio: dbr };
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

nestup -> phrase:* _:?

phrase ->
	_:? structure {% d => { dimension: dpd, structure: d[1] } %}
	_:? phrase_dimension _:? structure {% d => { return { dimension: d[1], structure: d[3] }} %}

phrase_dimension ->
	  %ls _:? number _:? %rs {% d => { return { length: d[2], beatRatio: dbr }} %}
	| %ls _:? number _:? %comma _:? number _:? %rs {% d => { return { length: d[2], beatRatio: d[6] }} %}

structure -> %lb _:? number tuple:* _:? %rb {% d => {return { division: d[2], subtuples: d[3] }} %}

tuple -> _:? extension _:? structure {% d => {return { extension: d[1], structure: d[3] }} %}

extension -> %lp _:? number _:? %comma _:? number _:? %rp {% d => {return { index: d[2], length: d[6] }} %}

number -> %unsigned_integer_tk {% d => parseInt(d.join("")) %}

_ -> %ws {% d => { return null; } %}
