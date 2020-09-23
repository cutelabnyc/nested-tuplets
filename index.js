const nearley = require("nearley");
const grammar = require("./build/grammar.js");
const fs = require("fs");

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
const testRhythm = fs.readFileSync("inputs/nested.rhy", "utf8");
parser.feed(testRhythm);

// parser.results is an array of possible parsings.
const results = parser.results[0];
console.log(results);
fs.writeFileSync("out.json", JSON.stringify(parser.results[0], null, 2));

class NestedTuplet {
	constructor(tupletDescription) {
		this._index = tupletDescription.extension.index;
		this._length = tupletDescription.extension.length;
		this._division = tupletDescription.structure.division;

		this._subtuples = tupletDescription.structure.subtuples.map(td => new NestedTuplet(td));
	}

	get index() {
		return this._index;
	}

	get length() {
		return this._length;
	}

	get division() {
		return this._division;
	}

	get subtuples() {
		return this._subtuples;
	}

	normalizedOnsetTimes() {
		let out = [];

		// Add an onset for each position that doesn't intersect a subtuple
		for (let i = 0; i < this._division; i++) {
			let intersector = this._subtuples.findIndex(s => s.intersects(i + 1));
			if (intersector === -1)
				out.push(i / this.division);
		}

		// Add onsets from all the other subtuples
		this._subtuples.forEach(st => {
			let offset = (st.index - 1) / this.division;
			let scale = st.length / this.division;
			let t = st.normalizedOnsetTimes();
			t.forEach(time => {
				out.push(time * scale + offset);
			});
		});

		return out.sort();
	}

	intersects(onsetTime) {
		return onsetTime >= this._index && onsetTime < (this._index + this._length);
	}
}

const nt = new NestedTuplet(results);
const times = nt.normalizedOnsetTimes();
console.log(times);
fs.writeFileSync("times.json", JSON.stringify(times, null, 2));
