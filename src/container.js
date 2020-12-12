const Interval = require("./interval");
const Onset = require("./onset");
const Fraction = require("fraction.js");

module.exports = class Container {
	constructor(containerDescription, index) {

		// Set internal proportionality and scale
		if (containerDescription.dimension) {
			const dim = containerDescription.dimension;
			this._proportionality = dim.proportionality ? new Fraction(dim.proportionality) : new Fraction(1);
			this._scale = dim.scale ? dim.scale : new Fraction(1);
		} else {
			this._proportionality = new Fraction(1);
			this._scale = new Fraction(1);
		}

		if (containerDescription.contents) {
			this._contents = containerDescription.contents.map((c, idx) => new Container(c, idx + 1));
		} else if (containerDescription.subdivisions){
			this._division = containerDescription.subdivisions.division;
			if (containerDescription.subdivisions.ranges) {
				this._ranges = containerDescription.subdivisions.ranges.map(({range, container}, idx) => {
					return {
						range: new Interval(range.index, range.length),
						container: new Container(container, idx + 1)
					}
				});
			} else {
				this._ranges = [];
			}
		} else {
			throw new Exception("A container description must have contents or subdivisions");
		}

		this._index = index;
	}

	get proportionality() {
		if (this._proportionality === "+") {
			if (this._contents) {
				return this._contents.reduce((prev, c) => { return prev.add(c.proportionality) }, new Fraction(0)).mul(this._scale);
			} else {
				return this._scale;
			}
		} else {
			return this._proportionality.mul(this._scale);
		}
	}

	get scale() {
		return this._scale;
	}

	normalizedOnsets() {
		let out = [];

		// Special case: if the division is one, we encode a rest.
		if (this._division === 0) {
			out.push(new Onset(
				new Fraction(0),
				Onset.type.OFF,
				(this._index !== undefined) ? `${this._index}` : undefined
			));

			return out;
		}

		if (this._contents) {
			let runningP = new Fraction(0);
			const totalP = this._contents.reduce((prev, c) => prev.add(c.proportionality), new Fraction(0));
			this._contents.forEach(c => {
				const onsets = c.normalizedOnsets();
				const scale = c.proportionality.div(totalP);
				onsets.forEach(o => {
					out.push(new Onset(
						o.time.mul(scale).add(runningP),
						o.type,
						(this._index !== undefined) ? `${this._index}${o.path}` : undefined
					));
				});
				runningP = runningP.add(scale);
			});
		} else {

			// Add an onset for each position that doesn't intersect a subtuplet
			for (let i = 0; i < this._division; i++) {
				let intersector = this._ranges.findIndex(({ range }) => range.intersects(i + 1));
				if (intersector === -1)
					out.push(new Onset(
						new Fraction(i, this._division),
						Onset.type.ON,
						this._index ? `${this._index}` : undefined
					));
			}

			// Add onsets from all the other subtuplets
			this._ranges.forEach(({range, container: st}) => {
				const {index, length} = range;
				let offset = new Fraction((index - 1), this._division);
				let scale = new Fraction(length, this._division);
				let onsets = st.normalizedOnsets();
				onsets.forEach(onset => {
					out.push(new Onset(
						onset.time.mul(scale).add(offset),
						onset.type,
						(this._index !== undefined) ? `${this._index}${onset.path}` : undefined
					));
				});
			});

			// sort
			out = out.sort((oa, ob) => {
				return oa.time.compare(ob.time);
			});
		}

		// Add an off event at the end
		out.push(new Onset(
			new Fraction(1.0),
			Onset.type.OFF,
			this._index ? `${this._index}` : undefined
		));;

		// Filter duplicates
		let i = 0;
		while (i < out.length) {
			if (i >= (out.length - 1))
				break;
			if (out[i].time.equals(out[i + 1].time)) {
				if (out[i].type === Onset.type.OFF && out[i + 1].type === Onset.type.ON) {
					out.splice(i, 1);
				} else if (out[i].type === Onset.type.ON && out[i + 1].type === Onset.type.OFF) {
					out.splice(i + 1, 1);
				} else {
					if (out[i].path && out[i + 1].path && out[i].path.length > out[i + 1].path.length) {
						out.splice(i + 1, 1);
					} else {
						out.splice(i, 1);
					}
				}
			} else {
				i++;
			}
		}

		return out;
	}
}
