import { inputModes } from './constants';

export const programState = {
	activeInputMode: inputModes.PROMPT,
	inputEnabled: true,
	scriptRunning: false,
	scriptAbort: false,
};
