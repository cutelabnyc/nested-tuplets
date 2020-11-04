const myTextArea = document.getElementById("nestup-input");

function sendTextToMax(text) {
	if (window.max) {
		if (text) {
			window.max.outlet.apply(window.max, ["text", text]);
		} else {
			window.max.outlet("text");
		}
	}
}

const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
	indentWithTabs: true,
	lineNumbers: false,
	tabSize: 2
});

window.cm = myCodeMirror;

window.max.bindInlet("text", (text) => {
	if (myCodeMirror) {
		myCodeMirror.setValue(text);
	}
});

window.max.bindInlet("mark", (line, col, token, message) => {
	if (myCodeMirror) {
		// If there's a token, mark it
		if (token) {
			const parsedToken = (token === "##comma##" ? "," : token);
			console.log(`Marking token ${parsedToken} at line ${line} col ${col}`);
			myCodeMirror.markText({line, ch: col}, {line, ch: col + parsedToken.length}, { className: "errortext" });
		}

		// Otherwise mark the whole line
		else {
			const lineText = myCodeMirror.getLine(line);
			myCodeMirror.markText({line, ch: 0}, {line, ch: lineText.length}, { className: "errortext" });
		}

		const errorBox = document.getElementsByClassName("errorBox")[0];
		errorBox.textContent = message;
		errorBox.hidden = false;
	}
});

function clearErrorBox() {
	const errorBox = document.getElementsByClassName("errorBox")[0];
	errorBox.textContent = "";
	errorBox.hidden = true;
}

myCodeMirror.on("change", () => {
	const text = myCodeMirror.getValue();
	if (text) {
		sendTextToMax(text);
	} else {
		sendTextToMax(null);
	}

	const marks = myCodeMirror.getAllMarks();
	if (marks.length === 0) {
		clearErrorBox();
	}
});

myCodeMirror.on("keydown", (_instance, event) => {
	if (event.shiftKey && event.key === "Enter") {

		const marks = myCodeMirror.getAllMarks();
		marks.forEach(mark => mark.clear());
		clearErrorBox();

		if (window.max) {
			window.max.outlet.apply(window.max, ["submit"]);
		}
		event.preventDefault();
	}
});
