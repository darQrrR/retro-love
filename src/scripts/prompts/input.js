import { commandReturns } from '../app/state.js';
import { storeVariable } from '../app/storage.js';

export async function promptInput(para) {
	// INPUT "INPUT NUMBER (can be float):"; A
	// INPUT "INPUT NUMBER (INT):"; A%
	// INPUT "INPUT STRING:"; A$		-> INPUT STRING
	// INPUT A1%, B, XY$ 				-> ? -> ? -> ?

	if (para.startsWith('"')) {
		const question = para.match(/"([^"]*)"/)?.[1];
		//output.textContent += `question\n`;
		//output.style.height = `${output.scrollHeight - 24}px`;
		//output.scrollTop = output.scrollHeight - output.offsetHeight - 24;
		//console.log(question);
	}

	return { type: commandReturns.INPUT, value: para };
}

export async function waitForUserInput(variableName) {
	return new Promise(resolve => {
		const handler = e => {
			if (e.key === 'Enter') {
				const inputValue = input.value.trim();
				storeVariable(variableName, inputValue);
				//output.textContent += `\n${inputValue}`;
				outputLine(inputValue);
				input.removeEventListener('keydown', handler);
				resolve(inputValue);
			}
		};
		// add temporary event listener
		input.addEventListener('keydown', handler);
	});
}
