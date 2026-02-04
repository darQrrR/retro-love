export function bindEvents({ dom, actions, state, dispatcher }) {
	const { input } = dom;
	const { runtime, inputModes } = state;

	// move cursor on input
	//TODO: blinking cursor movement with arrow-keys
	input.addEventListener('input', () => {
		const inputSize = input.value.length ? input.value.length : 1;
		input.setAttribute('size', inputSize);
		input.style.width = input.value.length === 0 ? '0px' : 'auto';
	});

	// force input focus
	input.addEventListener('blur', () => {
		input.focus();
	});

	// handle input
	// TODO: remove syntax error on empty enter
	const keysDown = [];
	input.addEventListener('keydown', e => {
		const key = e.key;

		if (!runtime.inputEnabled) {
			e.preventDefault();
			return;
		}

		if (key === 'Enter' && runtime.activeInputMode === inputModes.PROMPT) {
			const inputValue = input.value.toLowerCase().trim();
			actions.clearInput();
			actions.outputLine(inputValue);
			dispatcher.dispatchPrompt(inputValue);
			return;
		}

		// handle pressed keys
		if (keysDown.indexOf(e.key) === -1) {
			keysDown.push(e.key);
		}

		if (
			keysDown.length > 1 &&
			keysDown.includes('c') &&
			keysDown.includes('Control')
		) {
			scriptAbort = true;
		}
	});

	input.addEventListener('keyup', e => {
		const index = keysDown.indexOf(e.key);

		if (index !== -1) {
			keysDown.splice(index, 1);
		}
	});
}
