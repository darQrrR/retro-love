'use strict';

const input = document.querySelector('.input');
const output = document.querySelector('.output');
const commands = [
	{ cmd: 'print', para: 1, func: promptPrint },
	{ cmd: 'goto', para: 1, func: promptGoto },
	{ cmd: 'exit', para: 0, func: promptExit },
	{ cmd: 'clr', para: 0, func: promptClr },
	{ cmd: 'run', para: 0, func: promptRun },
];
let promptStorage = [];

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
		output.textContent += `${inputValue}\n\n`;

		// save prompt if line number was given
		const match = inputValue.match(/^\d+\s/);
		const hasLineNumber = match?.[0] ? true : false;
		const lineNumber = hasLineNumber ? match[0].trim() : null;
		const prompt = hasLineNumber
			? inputValue.slice(lineNumber.length + 1)
			: inputValue;
		const validatedPrompt = validatePrompt(prompt);
		const isValidPrompt = validatedPrompt.valid;

		if (!isValidPrompt) {
			output.textContent += `?Syntax Error\n`;
			resetInput();
			return;
		}

		// store prompt if line number was given
		if (hasLineNumber) {
			const { fn, para } = validatedPrompt;
			storePrompt({ lineNumber, fn, para });
		}

		// execute prompt if no linenumber was given
		if (!hasLineNumber) {
			console.log('executing');
			validatedPrompt.fn(validatedPrompt.para);
		}

		resetInput();
	}
});

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
		obj => obj.lineNumber === prompt.lineNumber
	);
	if (exists !== -1) promptStorage.splice(exists, 1);

	// push and sort new prompt
	promptStorage.push(prompt);
	promptStorage.sort((a, b) => a.lineNumber - b.lineNumber);
	console.log(promptStorage);
};

// clear input and add output line
const resetInput = () => {
	output.textContent += `Ready.\n`;

	output.style.height = `${output.scrollHeight - 24}px`;
	input.value = '';
	input.style.width = '0px';
};

// debug log
const clog = message => {
	output.textContent += `${message}\n`;
	output.style.height = `${output.scrollHeight - 24}px`;
};

// debounce
const sleep = ms => new Promise(res => setTimeout(res, ms));

/* BASIC V2 COMMANDS */
async function promptRun() {
	if (!promptStorage.length) return;

	const numPrompts = promptStorage.length;

	for (let i = 0; i < numPrompts; i++) {
		const answer = promptStorage[i].fn(promptStorage[i].para);

		// execute GOTO
		if (Number.isFinite(answer)) {
			i = answer - 1;
		}

		// add delay
		if (i < numPrompts - 1) await sleep(250);
	}
	return;
}

function promptPrint(para) {
	if (para) {
		output.textContent += `${para}\n`;
		output.style.height = `${output.scrollHeight - 24}px`;
	}
}

function promptGoto(para) {
	const targetLine = promptStorage.findIndex(obj => obj.lineNumber === para);
	console.log(`goto: ${para} -> ${targetLine}`);
	return targetLine;
}

function promptExit() {
	return;
}

function promptClr() {
	output.textContent = ``;
	output.style.height = '0px';
	input.value = '';
	input.style.width = '0px';
	return;
}
