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