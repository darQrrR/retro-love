/** C=64 Basic V2 Interpreter **/

'use strict';

import { evalString } from '../scripts/utils/strings.js';

const input = document.querySelector('.input');
const output = document.querySelector('.output');
const commands = [
	{ cmd: 'print', para: 1, func: promptPrint }, // print string
	{ cmd: 'goto', para: 1, func: promptGoto }, // jump to line
	{ cmd: 'input', para: 1, func: promptInput }, // input string
	{ cmd: 'exit', para: 0, func: promptExit }, // exit program
	{ cmd: 'clr', para: 0, func: promptClr }, // clear screen
	{ cmd: 'run', para: 0, func: promptRun }, // run stored prompts
];
const commandReturns = {
	// TODO: switch to TS enum
	DEFAULT: 'DEFAULT',
	GOTO: 'GOTO',
	STOP: 'STOP',
};
let promptStorage = [];
let variableStorage = [];

// test data
const testVariables = {
	A: 123,
	AB: 9,
	B: 2,
	C: 3,
	C$: 'STRING',
	'D%': 3.1415,
};

const testPrompts = [
	//'10 print "HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%',
	'10 print "hello"',
	'20 print "world"',
	'30 goto 10',
];

// init output
output.textContent = 'Ready.\n';

// move blinking cursor
input.addEventListener('input', () => {
	const inputSize = input.value.length ? input.value.length : 1;
	input.setAttribute('size', inputSize);
	input.style.width = input.value.length === 0 ? '0px' : 'auto';
});

// force input focus
input.addEventListener('blur', () => {
	input.focus();
});

// handle input
input.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		const inputValue = input.value.toLowerCase().trim();
		input.value = '';
		input.style.width = '0px';
		output.textContent += `${inputValue}\n`;
		enterPrompt(inputValue);
	}
});

// enter prompt
const enterPrompt = input => {
	// save prompt if line number was given
	const match = input.match(/^\d+\s/);
	const hasLineNumber = match?.[0] ? true : false;
	const lineNumber = hasLineNumber ? match[0].trim() : null;
	const prompt = hasLineNumber ? input.slice(lineNumber.length + 1) : input;
	const validatedPrompt = validatePrompt(prompt);
	const isValidPrompt = validatedPrompt.valid;

	if (!isValidPrompt) {
		output.textContent += `\n?Syntax Error\n`;
		resetInput(true);
		return;
	}

	// store prompt if line number was given
	if (hasLineNumber) {
		const { fn, para } = validatedPrompt;
		storePrompt({ lineNumber, fn, para });
		resetInput(false);
	}

	// execute prompt if no linenumber was given
	if (!hasLineNumber) {
		validatedPrompt.fn(validatedPrompt.para).then(() => {
			resetInput(true);
		});
	}
};

// validate prompt
const validatePrompt = prompt => {
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
};

// store prompt
const storePrompt = prompt => {
	// if linenumer already exists -> remove
	const exists = promptStorage.findIndex(
		obj => obj.lineNumber === prompt.lineNumber,
	);
	if (exists !== -1) promptStorage.splice(exists, 1);

	// push and sort new prompt
	promptStorage.push(prompt);
	promptStorage.sort((a, b) => a.lineNumber - b.lineNumber);
	//console.log(promptStorage);
};

// store variable
const storeVariable = (name, value) => {
	variableStorage[name] = value;
	//console.log(variableStorage);
};

// clear input and add output line
const resetInput = (ready = false) => {
	if (ready) output.textContent += `\nReady.\n`;
	output.style.height = `${output.scrollHeight - 24}px`;
	output.scrollTop = output.scrollHeight - output.offsetHeight - 24;
};

// debug log
const clog = message => {
	output.textContent += `${message}\n`;
	output.style.height = `${output.scrollHeight - 24}px`;
	output.scrollTop = output.scrollHeight - output.offsetHeight - 24;
};

// debounce
const sleep = ms => new Promise(res => setTimeout(res, ms));

/* BASIC V2 COMMANDS */
async function promptRun() {
	if (!promptStorage.length) return;

	const numPrompts = promptStorage.length;

	for (let i = 0; i < numPrompts; i++) {
		const answer = await promptStorage[i].fn(promptStorage[i].para);
		let sleepTime = 100;

		console.log(answer);

		// execute GOTO
		if (answer.type === commandReturns.GOTO) {
			i = answer.value - 1;
			sleepTime = 0;
		}

		// add delay
		if (i < numPrompts - 1) await sleep(sleepTime);
	}

	return { type: commandReturns.DEFAULT, value: null };
}

async function promptPrint(para) {
	if (para) {
		output.textContent += `${evalString(para, variableStorage)}\n`;
		output.style.height = `${output.scrollHeight - 24}px`;
		output.scrollTop = output.scrollHeight - output.offsetHeight - 24;
	}

	return { type: commandReturns.DEFAULT, value: null };
}

async function promptGoto(para) {
	const targetLine = promptStorage.findIndex(obj => obj.lineNumber === para);

	return { type: commandReturns.GOTO, value: targetLine };
}

async function promptInput(para) {
	// INPUT "INPUT NUMBER (can be float):"; A
	// INPUT "INPUT NUMBER (INT):"; A%
	// INPUT "INPUT STRING:"; A$		-> INPUT STRING
	// INPUT A1%, B, XY$ 				-> ? -> ? -> ?

	if (para) {
		console.log(para);
	}

	return { type: commandReturns.STOP, value: para };
}

async function promptExit() {
	return;
}

async function promptClr() {
	output.textContent = ``;
	output.style.height = '0px';
	input.value = '';
	input.style.width = '0px';

	return { type: commandReturns.DEFAULT, value: null };
}

/* TEST DATA */
if (typeof testPrompts !== 'undefined' && testPrompts.length) {
	for (let i = 0; i < testPrompts.length; i++) {
		enterPrompt(testPrompts[i]);
	}
}

if (typeof testVariables !== 'undefined' && Object.keys(testVariables).length) {
	for (let index in testVariables) {
		storeVariable(index, testVariables[index]);
	}
}
