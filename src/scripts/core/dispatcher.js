// dispatch prompt
export function createDispatcher({ actions, commands }) {
	function dispatchPrompt(inputPrompt) {
		// save prompt if line number was given
		const match = inputPrompt.match(/^\d+\s/);
		const hasLineNumber = match?.[0] ? true : false;
		const lineNumber = hasLineNumber ? match[0].trim() : null;
		const prompt = hasLineNumber
			? inputPrompt.slice(lineNumber.length + 1)
			: inputPrompt;
		const validatedPrompt = validatePrompt(prompt);
		const isValidPrompt = validatedPrompt.valid;

		if (!isValidPrompt) {
			actions.outputLine(`?Syntax Error`);
			actions.resetInput(true);
			return;
		}

		// store prompt if line number was given
		if (hasLineNumber) {
			const { fn, para } = validatedPrompt;
			storage.storePrompt({ lineNumber, fn, para });
			actions.resetInput(false);
		}

		// execute prompt if no linenumber was given
		if (!hasLineNumber) {
			validatedPrompt.fn(validatedPrompt.para).then(() => {
				actions.resetInput(true);
			});
		}
	}

	// validate prompt
	function validatePrompt(prompt) {
		const space = prompt.indexOf(' ');
		let command, parameter;

		if (space !== -1) {
			command = prompt.slice(0, space);
			parameter = space !== -1 ? prompt.slice(space + 1) : null;
		} else {
			command = prompt;
			parameter = null;
		}

		// check if cmd exists and parameters match
		const result = commands.find(c => c.cmd === command);

		if (!result) return false;

		const isValid = !!(
			(result.para && parameter) ||
			(!result.para && !parameter)
		);

		return {
			valid: isValid,
			fn: result.func,
			para: parameter,
		};
	}

	return { dispatchPrompt };
}
