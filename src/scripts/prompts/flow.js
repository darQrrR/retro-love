import * as storage from '../app/storage.js';
import { commandReturns, inputModes, runtime } from '../app/state.js';
import { waitForUserInput } from './input.js';

// debounce
const sleep = ms => new Promise(res => setTimeout(res, ms));

export async function promptRun() {
	if (!storage.promptStorage.length) return;

	const numPrompts = storage.promptStorage.length;
	runtime.scriptRunning = true;
	runtime.inputEnabled = false;

	for (let i = 0; i < numPrompts; i++) {
		const answer = await storage.promptStorage[i].fn(
			storage.promptStorage[i].para,
		);
		let sleepTime = 100;

		clearInput();

		// check if abort was pressed
		if (runtime.scriptAbort) {
			runtime.scriptAbort = false;
			runtime.scriptRunning = false;
			runtime.inputEnabled = true;
			return { type: commandReturns.DEFAULT, value: null };
		}

		// execute GOTO
		if (answer.type === commandReturns.GOTO) {
			i = answer.value - 1;
			sleepTime = 0;
		}

		// execute INPUT
		if (answer.type === commandReturns.INPUT) {
			runtime.activeInputMode = inputModes.INPUTVAR;
			runtime.inputEnabled = true;

			await waitForUserInput(answer.value);

			runtime.activeInputMode = inputModes.PROMPT;
			runtime.inputEnabled = false;
		}

		// add delay
		if (i < numPrompts - 1) await sleep(sleepTime);
	}

	runtime.scriptRunning = false;
	runtime.inputEnabled = true;
	return { type: commandReturns.DEFAULT, value: null };
}

export async function promptGoto(para) {
	const targetLine = storage.promptStorage.findIndex(
		obj => obj.lineNumber === para,
	);

	return { type: commandReturns.GOTO, value: targetLine };
}
