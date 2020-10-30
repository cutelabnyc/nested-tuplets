module.exports = class Onset {
	constructor(time, path) {
		this._time = time;
		this._path = path;
	}

	get time() { return this._time; }
	get path() { return this._path; }
}
