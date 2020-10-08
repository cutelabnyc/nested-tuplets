function note(n) {
	this._note = n;
}

function position(t, c) {
	this.track = t;
	this.clip = c;
}

function length(l) {
	this._length = l;
}

function times() {

	if (!this._length) {
		this._length = 4;
	}

	if (!this._note) {
		this._note = 48;
	}

	// Create a new clip and get its id
	var api = new LiveAPI("live_set tracks " + this.track + " clip_slots " + this.clip);
	if (api.get("has_clip") == 0) {
		api.call("create_clip", this._length);
	}

	// Fill it with midi notes
	var pathstr = "live_set tracks " + this.track + " clip_slots " + this.clip + " clip";
	var clipApi = new LiveAPI(pathstr);
	clipApi.call("set_notes");
	clipApi.call("notes", arguments.length);
	for (var i = 0; i < arguments.length; i++) {
		var time = arguments[i];
		var start = time * this._length;
		var end = i === arguments.length - 1 ? this._length - start : arguments[i + 1] * this._length - start;
		clipApi.call("note", this._note, (start).toFixed(4), (end).toFixed(4), 100, 0);
	}
	clipApi.call("done");
}
