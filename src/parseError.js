module.exports = class ParseError {
	constructor(rawNearleyError) {
		const errormessage = rawNearleyError.message;
		const splitByLine = errormessage.split("\n");
		const line1 = splitByLine[0];
		const dreg = /\d+/;

		let lineAnchor = line1.indexOf("line");
		let colAnchor = line1.indexOf("col");
		let line = Number.parseInt(dreg.exec(line1.substr(lineAnchor)));
		let col = Number.parseInt(dreg.exec(line1.substr(colAnchor)));
		this._line = line;
		this._col = col;

		const line5 = splitByLine[4];
		const periodAnchor = line5.indexOf(". ");
		const shortMessage = line5.substr(0, periodAnchor + 1);
		this._shortMessage = shortMessage;
	}

	get line() { return this._line; }
	get col() { return this._col; }
	get message() { return this._shortMessage; }
}
