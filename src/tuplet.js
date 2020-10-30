const Interval = require("./interval");
const Onset = require("./onset");

module.exports = class Tuplet {
	constructor(tupletDescription, index) {
		this._division = tupletDescription.division;

		this._subtuplets = tupletDescription.subtuplets.map(
			({extension, structure}) => { return {
				extension: new Interval(extension.index, extension.length),
				tuplet: new Tuplet(structure)
			}});

		this._index = index;
	}

	get division() {
		return this._division;
	}

	get subtuplets() {
		return this._subtuplets;
	}

	normalizedOnsets() {
		let out = [];

		// Add an onset for each position that doesn't intersect a subtuplet
		for (let i = 0; i < this._division; i++) {
			let intersector = this._subtuplets.findIndex(({ extension }) => extension.intersects(i + 1));
			if (intersector === -1)
				out.push(new Onset(
					i / this.division,
					`${this._index}`
				));
		}

		// Add onsets from all the other subtuplets
		this._subtuplets.forEach(({extension, tuplet: st}) => {
			const {index, length} = extension;
			let offset = (index - 1) / this.division;
			let scale = length / this.division;
			let onsets = st.normalizedOnsets();
			onsets.forEach(onset => {
				out.push(new Onset(
					onset.time * scale + offset,
					(this._index !== undefined) ? `${this._index}onset.path` : undefined
				));
			});
		});

		// sort
		out = out.sort((oa, ob) => {
			return oa.time - ob.time
		});

		// Filter duplicates
		let i = 0;
		while (i < out.length) {
			if (i >= (out.length - 1))
				break;
			if (out[i] === out[i + 1]) {
				out.splice(i, 1);
			} else {
				i++;
			}
		}

		return out;
	}
}
