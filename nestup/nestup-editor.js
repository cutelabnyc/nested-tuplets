const myTextArea = document.getElementById("nestup-input");

const myCodeMirror = CodeMirror.fromTextArea(myTextArea, {
	indentWithTabs: true,
	lineNumbers: true
});
