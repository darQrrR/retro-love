// clear input and add output line
export function createActions({ input, output }) {
	function clearInput() {
		input.value = '';
		input.style.width = '0px';
	}

	function outputLine(value) {
		output.textContent += `\n${value}`;
	}

	function resetInput(ready = false) {
		if (ready) outputLine(`\nReady.`);
	}

	return { clearInput, outputLine, resetInput };
}
