mgraphics.init();
mgraphics.relative_coords = 1;
mgraphics.autofill = 0;

var times = [];

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
	times.forEach(function (t, i) {
		var nextTime = ((i + 1) < times.length ? times[i+1] : 1);
		var nt1 = 2 * t - 1;
		var nt2 = 2 * nextTime - 1;
		mgraphics.move_to(nt1 * aspect, -1);
		mgraphics.line_to(nt1 * aspect, 1);
	});
	mgraphics.stroke();
}

function settimes() {
	times = arrayfromargs(messagename,arguments);
	mgraphics.redraw();
}
