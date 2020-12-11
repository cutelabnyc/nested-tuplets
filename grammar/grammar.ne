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
  plus: /\+/,
  underscore: /_/
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
// Container size
const dpd = { length: 4, beatRatio: dbr };
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

# A nestup is zero or more containers
nestup ->
	  _:* {% d => [] %}
	| container_list_or_subdivisions _:? {% d => d[0] %}

# The containers can be tied together
container_list_or_subdivisions ->
	  _:? subdivisions {% d => { return [{ dimension: undefined, subdivisions: d[1] }] } %}
	| container_list {% d => d[0] %}

container_list ->
	  container
	| container container_list {% d => { return [d[0]].concat(d[1]) } %}
	| container _:? %underscore container_list {% d => { d[0].tie = true; return [d[0]].concat(d[3]); } %}

# A container can be sized or unsized (necessary for indexed containers)
container ->
	  _:? sized_container {% d => d[1] %}
	| _:? unsized_container {% d => d[1] %}

# All containers must have either subcontainers or subdivisions, but not both
sized_container ->
	  sized_contents_with_subcontainers {% d => d[0] %}
	| sized_contents _:? subdivisions {% d => { return { dimension: d[0].dimension, subdivisions: d[2] }} %}

unsized_container ->
	  unsized_contents_with_subcontainers {% d => d[0] %}
	| unsized_contents _:? subdivisions {% d => { return { dimension: d[0].dimension, subdivisions: d[2] }} %}
	| unsized_contents {% d => { return { dimension: undefined }} %}

# Sized contents have explicit dimension
sized_contents -> %ls _:? dimension _:? %rs {% d => { return { dimension: d[2] }} %}

sized_contents_with_subcontainers ->
	  %ls _:? dimension container_list_or_subdivisions:? _:? %rs {% d => { return { dimension: d[2], contents: d[3] }} %}

# Unsized contents have no explicit dimension, only contents
unsized_contents ->
	%ls _:? %rs {% d => { return { dimension: undefined }} %}

unsized_contents_with_subcontainers ->
	%ls container_list_or_subdivisions _:? %rs {% d => { return { dimension: undefined, contents: d[1] }} %}

# Container dimension must include at least one of proportionality or scale
dimension ->
	  integer {% d => { return { proportionality: d[0], scale: new Fraction(1) }} %}
	| %comma _:? ratio {% d => { return { proportionality: 1, scale: d[2] }} %}
	| integer _:? %comma _:? ratio {% d => { return { proportionality: d[0], scale: d[4] }} %}
	| %plus {% d => { return { proportionality: "+", scale: 1 }} %}
	| %plus _:? %comma _:? ratio {% d => { return { proportionality: "+", scale: d[4] }} %}

# Subdivisions is just a subdivision number followed by a list of ranged containers
subdivisions ->
	  %lb ranged_container_list:? _:? %rb {% d => {return { division: 1, ranges: d[1] }} %}
	| %lb _:? integer ranged_container_list:? _:? %rb {% d => {return { division: d[2], ranges: d[3] }} %}

# Ranged containers can also be tied
ranged_container_list ->
	  ranged_container {% d => [d[0]] %}
	| ranged_container ranged_container_list {% d => [d[0]].concat(d[1]) %}
	| ranged_container _:? %underscore ranged_container_list {% d => { d[0].tie = true; return [d[0]].concat(d[3]); } %}

# A ranged container is a range followed by an unsized container, or a range followed by subdivisions
ranged_container ->
	  _:? range _:? unsized_container {% d => {return { range: d[1], container: d[3] }} %}
	| _:? range _:? subdivisions {% d => {return { range: d[1], container: { dimension: undefined, subdivisions: d[3] } }} %}

# A range is an index followed by an optional length (defaults to 1)
range ->
	  %lp _:? integer _:? %rp {% d => {return { index: d[2], length: 1 }} %}
	| %lp _:? integer _:? %comma _:? integer _:? %rp {% d => {return { index: d[2], length: d[6] }} %}

# A rational number is two integers separated by a slash
ratio ->
	  integer {% d => new Fraction(d[0])  %}
	| integer _:? %slash _:? integer {% d => new Fraction(d[0], d[4])  %}

# An integer is, well, an integer
integer -> %unsigned_integer_tk {% d => parseInt(d.join("")) %}

# Whitespace
_ -> %ws {% d => { return null; } %}
