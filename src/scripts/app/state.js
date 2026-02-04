export const commandReturns = Object.freeze({
	// TODO: switch to TS for real enum?
	DEFAULT: 'DEFAULT',
	GOTO: 'GOTO',
	INPUT: 'INPUT',
});

export const inputModes = Object.freeze({
	// TODO: switch to TS for real enum?
	PROMPT: 'PROMPT',
	INPUTVAR: 'INPUTVAR',
});

export const runtime = {
	activeInputMode: inputModes.PROMPT,
	inputEnabled: true,
	scriptRunning: false,
	scriptAbort: false,
};
