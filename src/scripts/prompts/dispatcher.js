import { dom } from '../ui/dom.js';
import { commands } from '../prompts/index.js';
import * as storage from '../app/storage.js';

// dispatch prompt
function createDispatcher() {
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
			dom.outputLine(`?Syntax Error`);
			dom.resetInput(true);
			return;
		}

		// store prompt if line number was given
		if (hasLineNumber) {
			const { fn, para } = validatedPrompt;
			storage.storePrompt({ lineNumber, fn, para });
			dom.resetInput(false);
		}

		// execute prompt if no linenumber was given
		if (!hasLineNumber) {
			validatedPrompt.fn(validatedPrompt.para).then(() => {
				dom.resetInput(true);
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

		//console.log(result.para);
		//console.log(parameter);

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

export const dispatcher = createDispatcher();
