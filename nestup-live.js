function note(n) {
	this._note = n;
}

function slotid(id) {
	this._slotid = id;
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

	var clipApi;
	if (this.clip && this.track) {
		// Create a new clip and get its id
		var api = new LiveAPI("live_set tracks " + this.track + " clip_slots " + this.clip);
		if (api.get("has_clip") == 0) {
			api.call("create_clip", this._length);
		}

		// API for the clip itself
		var pathstr = "live_set tracks " + this.track + " clip_slots " + this.clip + " clip";
		clipApi = new LiveAPI(pathstr);
	} else if (this._slotid !== undefined) {
		var api = new LiveAPI("id " + this._slotid);
		if (api.get("has_clip") == 0) {
			api.call("create_clip", this._length);
		}

		var clipid = api.get("clip");
		clipApi = new LiveAPI(clipid);
	}

	// Set the notes
	clipApi.set("length", this._length);
	clipApi.set("loop_start", 0);
	clipApi.set("loop_end", this._length);
	clipApi.call("select_all_notes");
	clipApi.call("replace_selected_notes");
	clipApi.call("notes", arguments.length);
	for (var i = 0; i < arguments.length; i++) {
		var time = arguments[i];
		var start = time * this._length;
		var end = i === arguments.length - 1 ? this._length - start : arguments[i + 1] * this._length - start;
		clipApi.call("note", this._note, (start).toFixed(4), (end).toFixed(4), 100, 0);
	}
	clipApi.call("done");
}
