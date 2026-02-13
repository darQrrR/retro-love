/**
 * Parses String char by char and tokenizes it into an array of objects.
 * Each object contains a value and a type.
 * Types can be: 'string', 'number', 'variable', 'operator', 'separator'.
 *
 * @param {string} string - The string to be evaluated and tokenized.
 * @param {object} variables - An object containing variables to be substituted in the string.
 * @return {Array} An array of objects representing the tokenized string, with each object containing a value and a type.
 */

export function tokenize(string) {
  const operators = ['+', '-', '*', '/', '%'];
  const outputSeparators = [';', ','];
  const types = ['$', '%'];
  let outputs = [];
  let buffer = '';
  let stringmode = false;
  let nummode = false;
  let varmode = false;

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

    // add char to string-buffer
    if (stringmode) {
      buffer += char;
      continue;
    }

    // remove spaces if not in stringmode
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

    // add number to number-buffer
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

    // add char to variable-buffer
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

  return outputs;
}

export function substituteVariables(tokenizedString, variables) {
  for (let i = 0; i < tokenizedString.length; i++) {
    const o = tokenizedString[i];
    if (o.type === 'variable') {
      tokenizedString[i] = {
        value: variables[o.value],
        type: typeof variables[o.value],
      };
    }
  }

  return tokenizedString;
}

export function parse(outputs) {
  let output = '';
  let calculation = null;

  for (let i = 0; i < outputs.length; i++) {
    const o = outputs[i];
    //console.log(o);

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
  }

  return output;
}

export function determineVariableType(variable) {
  if (variable.split(-1) === '$') {
    return 'string';
  }
  if (variable.split(-1) === '%') {
    return 'integer';
  }
  return 'float';
}

export function assignVariableType(prompt) {
  const trimmed = prompt.trim();

  if (/^[-+]?\d+$/.test(trimmed)) {
    return 'integer';
  }

  if (/^[-+]?\d*\.\d+$/.test(trimmed)) {
    return 'float';
  }

  return 'string';
}
