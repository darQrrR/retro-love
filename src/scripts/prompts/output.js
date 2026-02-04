import { evalString } from '../../scripts/utils/strings.js';
import { commandReturns } from '../app/state.js';
import * as storage from '../app/storage.js';

export async function promptPrint(para) {
	if (para) {
		outputLine(evalString(para, storage.variableStorage));
		//output.textContent += `\n${evalString(para, storage.variableStorage)}`;
		//output.style.height = `${output.scrollHeight - 24}px`;
		//output.scrollTop = output.scrollHeight - output.offsetHeight - 24;
	}

	return { type: commandReturns.DEFAULT, value: null };
}

// debug log
export const c64log = message => {
	//outputField.textContent += `\n${message}`;
	outputLine(message);
	//outputField.style.height = `${outputField.scrollHeight - 24}px`;
	//outputField.scrollTop = outputField.scrollHeight - outputField.offsetHeight - 24;
};
