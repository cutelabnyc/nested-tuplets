const Tuplet = require("./tuplet");
const Fraction = require("fraction.js");

module.exports = class Phrase {
	constructor(phraseDescription, index) {
		this._length = phraseDescription.dimension.length;
		this._beatRatio = phraseDescription.dimension.beatRatio;
		this._tuplet = new Tuplet(phraseDescription.structure, index);
	}

	get length() { return this._length; }

	get beatRatio() { return this._beatRatio; }

	normalizedOnsets() {
		return this._tuplet.normalizedOnsets();
	}
}
