# Add the moo lexer
@{%
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
%}

# Pass your lexer object using the @lexer option:
@lexer lexer

tuple -> _:? extension _:? structure _:? {% d => {return { extension: d[1], structure: d[3] }} %}

extension -> %lp _:? index _:? %comma _:? length _:? %rp {% d => {return { index: d[2], length: d[6] }} %}

structure -> %lb _:? division _:? tuple:* _:? %rb _:? {% d => {return { division: d[2], subtuples: d[4] }} %}

index -> %number {% d => parseInt(d.join("")) %}

length -> %number {% d => parseInt(d.join("")) %}

division -> %number {% d => parseInt(d.join("")) %}

_ -> %ws {% d => { return null; } %}
