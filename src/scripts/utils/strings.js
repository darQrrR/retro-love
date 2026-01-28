export function tokenize(string, variables) {
	const operators = ['+', '-', '*', '/', '%'];
	const outputSeparators = [';', ','];
	const types = ['$', '%'];
	let outputs = [];
	let stringmode = false;
	let nummode = false;
	let varmode = false;
	let buffer = '';
	let output = '';

	// tokenize string
	for (let i = 0; i <= string.length; i++) {
		const char = string[i];

		// turn stringmode on
		if (char === '"' && !stringmode) {
			stringmode = true;
			continue;
		}

		// turn stringmode off
		if (char === '"' && stringmode) {
			outputs.push({ value: buffer, type: 'string' });
			stringmode = false;
			buffer = '';
			continue;
		}

		// run stringmode
		if (stringmode) {
			buffer += char;
			continue;
		}

		// ignore spaces if not in stringmode
		if (!stringmode && char === ' ') {
			continue;
		}

		// turn nummode on
		if (/^[0-9.]$/.test(char) && !nummode) {
			nummode = true;
			buffer += char;
			continue;
		}

		// turn nummode off
		if (!/^[0-9.]$/.test(char) && nummode) {
			outputs.push({ value: Number(buffer), type: 'number' });
			buffer = '';
			nummode = false;
		}

		// run nummode
		if (/^[0-9.]$/.test(char) && nummode) {
			// if decimal is already set, start new number
			if (char === '.' && buffer.includes('.')) {
				outputs.push({ value: Number(buffer), type: 'number' });
				buffer = char;
				continue;
			}

			buffer += char;
			continue;
		}

		// turn varmode on
		if (/^[A-Za-z]$/.test(char) && !varmode) {
			varmode = true;
			buffer += char;
			continue;
		}

		// turn varmode off
		if ((!/^[A-Za-z]$/.test(char) || types.includes(char)) && varmode) {
			if (types.includes(char)) {
				buffer += char;
				outputs.push({ value: buffer, type: 'variable' });
				buffer = '';
				varmode = false;
				continue;
			}

			outputs.push({ value: buffer, type: 'variable' });
			buffer = '';
			varmode = false;
		}

		// run varmode
		if (/^[A-Za-z]$/.test(char) && varmode) {
			buffer += char;
			continue;
		}

		// operators
		if (operators.includes(char)) {
			outputs.push({ value: char, type: 'operator' });
		}

		// separators
		if (outputSeparators.includes(char)) {
			outputs.push({ value: char, type: 'separator' });
		}
	}

	// variable substitution
	for (let i = 0; i < outputs.length; i++) {
		const o = outputs[i];
		if (o.type === 'variable') {
			outputs[i] = {
				value: variables[o.value],
				type: typeof variables[o.value],
			};
		}
	}

	// parse tokenized string
	let calculation = null;

	for (let i = 0; i < outputs.length; i++) {
		const o = outputs[i];
		console.log(o);

		if (o.type === 'string') {
			output += o.value;
			continue;
		}

		if (calculation && o.type === 'separator') {
			// execute calculation
			output += eval(calculation);
			output += ' ';
			calculation = null;
			continue;
		}

		if (o.type === 'separator') {
			output += ' ';
		}

		if (o.type === 'number') {
			if (calculation) {
				calculation += o.value;
				continue;
			}
			if (outputs[i + 1] && outputs[i + 1].type === 'operator') {
				calculation = o.value;
				continue;
			}
			output += o.value;
			continue;
		}

		if (o.type === 'operator') {
			if (calculation) {
				calculation += o.value;
				continue;
			}
		}

		if (calculation) {
			console.log(calculation);
		}
		//output += o.value;
	}

	return output;
}
