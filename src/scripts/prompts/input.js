import { promptTypes } from '../app/constants.js';
import { storeVariable } from '../app/storage.js';
import * as strings from '../../scripts/utils/strings.js';
import { dom } from '../ui/dom.js';

export async function INPUT(para) {
	// INPUT "INPUT NUMBER (can be float):"; A
	// INPUT "INPUT NUMBER (INT):"; A%
	// INPUT "INPUT STRING:"; A$		-> INPUT STRING
	// INPUT A1%, B, XY$ 				-> ? -> ? -> ?

	const tokens = strings.tokenize(para);

	// check if input starts with question
	if (
		tokens[0].type === 'string' &&
		tokens[1].value === ';' &&
		tokens[2].type === 'variable'
	) {
		dom.outputLine(tokens[0].value);
	}

	// extract variables
	const vars = tokens.slice(2);

	const separatorsValid = vars.every((value, index) =>
		index % 2 === 1 ? value.value === ',' : true,
	);

	const variablesValid = vars.every((value, index) =>
		index % 2 === 0 ? value.type === 'variable' : true,
	);
	// TODO: check if last element is variable, not seperator
	// invalild input
	if (!separatorsValid || !variablesValid) {
		return { type: promptTypes.DEFAULT, value: null };
	}

	const requestedVariables = vars.filter((_, i) => i % 2 === 0);
	return { type: promptTypes.INPUT, value: requestedVariables };
}

export async function waitForUserInput(variableName) {
	return new Promise(resolve => {
		const handler = e => {
			if (e.key === 'Enter') {
				const inputValue = dom.input.value.trim();
				storeVariable(variableName, inputValue);

				dom.outputLine(inputValue);
				dom.clearInput();
				dom.input.removeEventListener('keydown', handler);
				resolve(inputValue);
			}
		};
		// add temporary event listener
		dom.input.addEventListener('keydown', handler);
	});
}
