import * as storage from '../app/storage.js';
import { promptTypes, inputModes } from '../app/constants.js';
import { programState } from '../app/state.js';
import { dom } from '../ui/dom.js';
import { waitForUserInput } from './input.js';

// debounce
const sleep = ms => new Promise(res => setTimeout(res, ms));

export async function RUN() {
	if (!storage.promptStorage.length) return;

	const numPrompts = storage.promptStorage.length;
	programState.scriptRunning = true;
	programState.inputEnabled = false;

	for (let i = 0; i < numPrompts; i++) {
		const answer = await storage.promptStorage[i].fn(
			storage.promptStorage[i].para,
		);
		let sleepTime = 100;

		dom.clearInput();

		// check if abort was pressed
		if (programState.scriptAbort) {
			programState.scriptAbort = false;
			programState.scriptRunning = false;
			programState.inputEnabled = true;
			return { type: promptTypes.DEFAULT, value: null };
		}

		// execute GOTO
		if (answer.type === promptTypes.GOTO) {
			i = answer.value - 1;
			sleepTime = 0;
		}

		// execute INPUT
		if (answer.type === promptTypes.INPUT) {
			programState.activeInputMode = inputModes.INPUTVAR;
			programState.inputEnabled = true;

			for (let j = 0; j < answer.value.length; j++) {
				await waitForUserInput(answer.value[j].value);
			}

			programState.activeInputMode = inputModes.PROMPT;
			programState.inputEnabled = false;
		}

		// add delay
		if (i < numPrompts - 1) await sleep(sleepTime);
	}

	programState.scriptRunning = false;
	programState.inputEnabled = true;
	return { type: promptTypes.DEFAULT, value: null };
}

export async function GOTO(para) {
	const targetLine = storage.promptStorage.findIndex(
		obj => obj.lineNumber === para,
	);

	return { type: promptTypes.GOTO, value: targetLine };
}

export async function IF(para) {
	return { type: promptTypes.DEFAULT, value: null };
}
