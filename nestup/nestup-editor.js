const myTextArea = document.getElementById("nestup-input");

function sendTextToMax(text) {
	if (window.max) {
		window.max.outlet.apply(window.max, ["text", text]);
	}
}

const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
	indentWithTabs: true,
	lineNumbers: true,
	tabSize: 2
});

window.max.bindInlet("text", (text) => {
	if (myCodeMirror) {
		myCodeMirror.setValue(text);
	}
});

myCodeMirror.on("change", () => {
	const text = myCodeMirror.getValue();
	if (text) sendTextToMax(text);
});

myCodeMirror.on("keydown", (_instance, event) => {
	if (event.shiftKey && event.key === "Enter") {
		if (window.max) {
			window.max.outlet.apply(window.max, ["submit"]);
		}
		event.preventDefault();
	}
});
