const Tuplet = require("./tuplet");

module.exports = class Phrase {
	constructor(phraseDescription) {
		this._length = phraseDescription.dimension.length;
		this._beatRatio = phraseDescription.dimension.beatRatio;
		this._tuplet = new Tuplet(phraseDescription.structure);
	}

	get length() { return this._length; }

	get beatRatio() { return this._beatRatio; }

	normalizedOnsetTimes() {
		return this._tuplet.normalizedOnsetTimes();
	}
}
