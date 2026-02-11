import { promptTypes } from '../app/constants.js';
import { dom } from '../ui/dom.js';

export async function CLR() {
  dom.clearOutput();
  dom.clearInput();

  return { type: promptTypes.DEFAULT, value: null };
}

export async function REM(message) {
  return { type: promptTypes.DEFAULT, value: null };
}

export async function EXIT() {
  return { type: promptTypes.DEFAULT, value: null };
}

// debug log
export const C64LOG = message => {
  dom.outputLine(message);
};
