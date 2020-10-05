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
yarn run start -i <path-to-input> <output-file-name>
```

For example, you could run

```sh
yarn run start -i inputs/easy.rhy output
```

to process the input file at `inputs/easy.rhy` and write the output to `./output.mid`. File watching is also possible.

```sh
yarn run start -i inputs/easy.rhy -w output
```

will start watching the file `inputs/easy.rhy`. Any changes will be written to the directory at `output`.
