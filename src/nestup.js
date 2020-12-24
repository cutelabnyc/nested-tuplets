const Container = require("./container");
const Onset = require("./onset");
const Fraction = require("fraction.js");
const memoize = require("memoizee");

module.exports = class Nestup {
	constructor(parseTree) {
		// Nestup roots everything in a single, additive container
		const rootContainerDescripiton = { dimension: { proportionality: "+", scale: 1 }, contents: parseTree };
		this._rootContainer = new Container(rootContainerDescripiton, 1);
	}

	get beatLength() {
		return this._inherentLength().valueOf();
	}

	onOffEvents(gridsize) {
		let events = this._onOffEvents();
		if (gridsize) {
			events = this._snapToGrid(events, gridsize);
		}
		return this._toFloats(events);
	}

	_inherentLength = memoize(() => {
		return this._rootContainer.proportionality;
	});

	_normalizedOnsets = memoize(() => {
		return this._rootContainer.normalizedOnsets();
	});

	_snapToGrid = memoize((events, tickDuration) => {
		return events.map(e => {
			return {
				time: Math.round(e.time.mul(tickDuration).valueOf()),
				on: e.on,
				path: e.path
			};
		});
	});

	_onOffEvents = memoize(() => {
		const onsets = this._normalizedOnsets();
		let lastOnset = null;
		let outEvents = [];

		onsets.forEach(e => {
			if (e.type === Onset.type.ON) {
				if (lastOnset && lastOnset.type === Onset.type.ON) {
					outEvents.push({
						time: e.time,
						on: false,
						path: e.path
					});
				}

				outEvents.push({
					time: e.time,
					on: true,
					path: e.path
				});
			}

			else {
				if (lastOnset && lastOnset.type === Onset.type.ON) {
					outEvents.push({
						time: e.time,
						on: false,
						path: e.path
					});
				}
			}

			lastOnset = e;
		});

		if (lastOnset && lastOnset.type === Onset.type.ON) {
			outEvents.push({
				time: new Fraction(1),
				on: false,
				path: lastOnset.path
			});
		}

		return outEvents;
	});

	_toFloats = memoize((events) => {
		return events.map(e => Object.assign({}, e, { time: e.time.valueOf() }));
	});
}
