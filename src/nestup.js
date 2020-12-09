const Phrase = require("./phrase");
const Onset = require("./onset");
const Fraction = require("fraction.js");
const memoize = require("memoizee");

module.exports = class Nestup{
	constructor(parseTree) {
		this._phrases = parseTree.map((p, idx) => new Phrase(p, idx + 1));
	}

	inherentLength = memoize(() => {
		return this._phrases.reduce((prev, {length, beatRatio}) => beatRatio.mul(length).add(prev), new Fraction(0));
	});

	normalizedOnsets = memoize(() => {
		// Collect the total number of beats
		const totalBeats = this.inherentLength();

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

	tickSnappedEvents = memoize((tickDuration) => {
		const onsets = this.normalizedOnsets();
		return onsets.map(o => {
			return {
				time: Math.round(o.time.mul(tickDuration).valueOf()),
				isRest: o.type === Onset.type.OFF,
				path: o.path
			};
		});
	});

	asOnOffEvents = memoize((tickDuration) => {
		const snappedEvents = this.tickSnappedEvents(tickDuration);
		let lastEvent = null;
		let outEvents = [];

		snappedEvents.forEach(e => {
			if (!e.isRest) {
				if (lastEvent && !lastEvent.isRest) {
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
				if (lastEvent && !lastEvent.isRest) {
					outEvents.push({
						time: e.time,
						on: false,
						path: e.path
					});
				}
			}

			lastEvent = e;
		});

		if (lastEvent && !lastEvent.isRest) {
			outEvents.push({
				time: tickDuration,
				on: false,
				path: lastEvent.path
			});
		}

		return outEvents;
	});
}
