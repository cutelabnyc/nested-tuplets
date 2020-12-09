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
  rb: /\}/,
	ls: /\[/,
	rs: /\]/,
	slash: /\//,
});
%}

# Requires
@{%
const Fraction = require("fraction.js");
%}

# Default structures
@{%
// Beat ratio
const dbr = new Fraction(1);
// Phrase dimension
const dpd = { length: 4, beatRatio: dbr };
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

# A nestup is zero or more phrases
nestup -> phrase:* _:? {% d => (d[0] ? d[0] : []) %}

# A phrase is just structure, with an optional phrase dimension
phrase ->
	  _:? structure {% d => { return { dimension: dpd, structure: d[1] }} %}
	| _:? phrase_dimension _:? structure {% d => { return { dimension: d[1], structure: d[3] }} %}

# A phrase dimention is a beat length with an optional beat ratio
phrase_dimension ->
	  %ls _:? number _:? %rs {% d => { return { length: d[2], beatRatio: dbr }} %}
	| %ls _:? number _:? %comma _:? number _:? %rs {% d => { return { length: d[2], beatRatio: new Fraction(d[6]) }} %}
	| %ls _:? number _:? %comma _:? number _:? %slash _:? number _:? %rs {% d => { return { length: d[2], beatRatio: new Fraction(d[6], d[10]) }} %}

# Structure is just a number of subdivisions followed by a list of tuplets
structure -> %lb _:? number tuplet:* _:? %rb {% d => {return { division: d[2], subtuplets: d[3] }} %}

# A tuplet is a tuplet extension followed by a structure
tuplet -> _:? extension _:? structure {% d => {return { extension: d[1], structure: d[3] }} %}

# A tuplet extension is an index followed by a length
extension -> %lp _:? number _:? %comma _:? number _:? %rp {% d => {return { index: d[2], length: d[6] }} %}

# A number is, well, a number
number -> %unsigned_integer_tk {% d => parseInt(d.join("")) %}

# Whitespace
_ -> %ws {% d => { return null; } %}
