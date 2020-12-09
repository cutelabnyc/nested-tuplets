const Phrase = require("./phrase");
const Onset = require("./onset");
const Fraction = require("fraction.js");
const memoize = require("memoizee");

module.exports = class Nestup{
	constructor(parseTree) {
		this._phrases = parseTree.map((p, idx) => new Phrase(p, idx + 1));
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
		return this._phrases.reduce((prev, {length, beatRatio}) => beatRatio.mul(length).add(prev), new Fraction(0));
	});

	_normalizedOnsets = memoize(() => {
		// Collect the total number of beats
		const totalBeats = this._inherentLength();

		// Scale the normalized onset times in each phrase by the beat length in each phrase
		let beatOffset = new Fraction(0);
		let onsets = [];
		this._phrases.forEach(p => {
			const { length, beatRatio } = p;
			const phraseOnsets = p.normalizedOnsets();
			const scaledOnsetTimes = phraseOnsets.map(po => new Onset(
				beatRatio.mul(length).mul(po.time).div(totalBeats).add(beatOffset),
				po.type,
				po.path)
			);
			beatOffset = beatOffset.add(beatRatio.mul(length).div(totalBeats));
			onsets = onsets.concat(scaledOnsetTimes);
		});

		return onsets;
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
