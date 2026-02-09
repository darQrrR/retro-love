import { promptTypes } from '../app/constants.js';
import * as storage from '../app/storage.js';
import * as strings from '../../scripts/utils/strings.js';
import { dom } from '../ui/dom.js';

export async function PRINT(para) {
	if (para) {
		const tokenized = strings.tokenize(para);
		const substituted = strings.substituteVariables(
			tokenized,
			storage.variableStorage,
		);
		const parsed = strings.parse(substituted);
		dom.outputLine(parsed);
	}

	return { type: promptTypes.DEFAULT, value: null };
}

export async function LIST() {
	// TODO: list prompts of range, e.g. LIST 30,80
	storage.promptStorage.forEach(prompt => {
		dom.outputLine(`${prompt.lineNumber} ${prompt.fn.name} ${prompt.para}`);
	});
}
