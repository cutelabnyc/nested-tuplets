class Onset {
	constructor(time, type, path) {
		this._time = time;
		this._type = type;
		this._path = path;
	}

	get time() { return this._time; }
	get type() { return this._type; }
	get path() { return this._path; }
}

Onset.type = Object.freeze({
	ON: "ON",
	OFF: "OFF",
});

module.exports = Onset;
