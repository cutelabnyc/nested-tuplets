mgraphics.init();
mgraphics.relative_coords = 1;
mgraphics.autofill = 0;

var onsets = [];

var colors = {};

var hc_colors = [
	[230, 25, 75],
	[60, 180, 75],
	[255, 225, 25],
	[0, 130, 200],
	[245, 130, 48],
	[145, 30, 180],
	[70, 220, 220],
	[240, 50, 230],
	[210, 245, 60],
	[0, 128, 128],
	[170, 110, 40],
	[128, 0, 0],
	[128, 128, 0],
	[0, 0, 128]
];

var color_offset = Math.floor(Math.random() * hc_colors.length);

function randomColor() {
	var color = hc_colors[color_offset].slice().map(function (c) { return c / 255; });
	color_offset = (color_offset + 1) % hc_colors.length;
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
		if (time !== 0) {
			mgraphics.set_source_rgba(1, 1, 1, 1);
			mgraphics.move_to(nt1 * aspect, 1);
			mgraphics.line_to(nt1 * aspect, -1);
			mgraphics.stroke();
		}
	}
}

function setonsets() {
	onsets = arrayfromargs(messagename, arguments).slice(1);
	mgraphics.redraw();
}
