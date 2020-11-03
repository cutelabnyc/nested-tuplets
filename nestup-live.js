function note(n) {
	this._note = n;
}

function slotid(id) {
	clearCurrentAnimation();
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

	if (clipApi === undefined) return;

	// Set the notes
	clipApi.set("length", this._length);
	clipApi.set("loop_start", 0);
	clipApi.set("loop_end", this._length);
	clipApi.call("remove_notes", (0).toFixed(4), this._note, (this._length).toFixed(4), 0);
	clipApi.call("set_notes");
	clipApi.call("notes", arguments.length);
	for (var i = 0; i < arguments.length; i++) {
		var time = arguments[i];
		var start = time * this._length;
		var end = i === arguments.length - 1 ? this._length - start : arguments[i + 1] * this._length - start;
		clipApi.call("note", this._note, (start).toFixed(4), (end).toFixed(4), 100, 0);
	}
	clipApi.call("done");
	animateClipColor();
}

function clearCurrentAnimation() {
	if (this._currentAnimation) {
		this._currentAnimation.task.cancel();
		this._currentAnimation.task.freepeer();
		var targetId = this._currentAnimation.id;
		var targetAPI = new LiveAPI(targetId);
		targetAPI.set("color", this._currentAnimation.targetColor);
		this._currentAnimation = null;
	}
}

function interpolateColor(color, distance) {
	var colorRed = (color >> 16) & 255;
	var colorGreen = (color >> 8) & 255;
	var colorBlue = (color) & 255;
	colorRed = Math.floor(colorRed + (1 - Math.min(1.0, distance)) * (255 - colorRed));
	colorGreen = Math.floor(colorGreen + (1 - Math.min(1.0, distance)) * (255 - colorGreen));
	colorBlue = Math.floor( colorBlue + (1 - Math.min(1.0, distance)) * (255 - colorBlue));
	return (colorRed << 16) + (colorGreen << 8) + colorBlue;
}

function animLoop() {
	var targetId = this._currentAnimation.id;
	var targetAPI = new LiveAPI(targetId);
	var color = interpolateColor(this._currentAnimation.targetColor, this._currentAnimation.phase);
	targetAPI.set("color", color);
	this._currentAnimation.phase += this._currentAnimation.del;
	if (this._currentAnimation.phase > 1.0) {
		clearCurrentAnimation()
	}
}

function animateClipColor() {
	if (this._slotid !== undefined) {
		var slotApi = new LiveAPI("id " + this._slotid);
		if (!slotApi.get("has_clip"))
			return;
		var clipid = slotApi.get("clip");
		clipApi = new LiveAPI(clipid);

		var targetColor;
		if (this._currentAnimation) {
			targetColor = this._currentAnimation.targetColor;
		} else {
			targetColor = clipApi.get("color");
		}

		if (this._currentAnimation) {
			clearCurrentAnimation();
		}

		this._currentAnimation = {
			id: clipid,
			targetColor: targetColor,
			phase: 0,
			del: 0.10
		};

		this._currentAnimation.task = new Task(animLoop)
		this._currentAnimation.task.interval = 33;
		this._currentAnimation.task.repeat();
	}
}
