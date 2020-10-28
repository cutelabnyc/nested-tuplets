module.exports = class Interval{
	constructor(index, length) {
		this._index = index;
		this._length = length;
	}

	get index() { return this._index; }
	get length() { return this._length; }

	intersects(index) {
		return index >= this.index && index < (this.index + this.length);
	}
}
