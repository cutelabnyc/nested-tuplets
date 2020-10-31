mgraphics.init();
mgraphics.relative_coords = 1;
mgraphics.autofill = 0;

var onsets = [];

var colors = {};

function randomColor() {
	var color = [];
	for (var i = 0; i < 3; i++) {
		color.push(Math.random());
	}
	color.push(1);
	return color;
}

function colorForPath(p) {
	var color = colors[p];
	if (!color) {
		colors[p] = randomColor();
		color = colors[p];
	}
	return color;
}

function calcAspect() {
	var width = this.box.rect[2] - this.box.rect[0];
	var height = this.box.rect[3] - this.box.rect[1];
	return width/height;
}

function paint() {
	const aspect = calcAspect();
	mgraphics.set_source_rgba(0, 0, 0, 1);
	mgraphics.rectangle(-1 * aspect, 1, 2 * aspect, 2);
	mgraphics.fill();

	mgraphics.set_source_rgba(1, 1, 1, 1);

	for (var i = 0; i < onsets.length; i+=2) {
		var time = onsets[i];
		var path = onsets[i+1];
		var nextTime = ((i + 2) < onsets.length ? onsets[i+2] : 1);
		var nt1 = 2 * time - 1;
		var nt2 = 2 * nextTime - 1;
		var color = colorForPath(path);
		mgraphics.set_source_rgba(color[0], color[1], color[2], color[3]);
		mgraphics.rectangle(nt1 * aspect, 1, (nt2 - nt1) * aspect, 2);
		mgraphics.fill();
		mgraphics.rectangle(nt1 * aspect, 1, (nt2 - nt1) * aspect, 2);
		mgraphics.set_source_rgba(1, 1, 1, 1);
		mgraphics.stroke();
		// mgraphics.set_source_rgba(1, 1, 1, 1);
	}
}

function setonsets() {
	onsets = arrayfromargs(messagename, arguments).slice(1);
	mgraphics.redraw();
}
