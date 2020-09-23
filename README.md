# Nested Tuplet Generator

It's a domain specific language for describing and generating nested tuplets, just like you've always wanted.

## Getting set up

This library uses `yarn` as opposed to `npm`, so before you can do anything else you'll need `yarn` installed on your system. From there simply run

```sh
yarn install
```

to get the repo all set up.

## Generating rhythms

You can see some examples of input patters in the `inputs` directory. For now the grammar only supports nested tuplets, without any affordances for velocity or note duration. To generate a new rhythm, simply run

```sh
yarn run start
```

This will generate a midi file called `out.mid`. The input for this script is hardcoded in `index.js`. For now, simply edit this file

```js
// index.js

// Parse something!
const testRhythm = fs.readFileSync("inputs/nested.rhy", "utf8");
parser.feed(testRhythm);
```

in order to consume a different input file.
