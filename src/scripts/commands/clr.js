import { commandTypes } from '../app/constants.js';
import { dom } from '../ui/dom.js';

// TODO: CLR should actually clear the variables
export async function CLR() {
  dom.clearOutput();
  dom.clearInput();

  return { type: commandTypes.DEFAULT, value: null };
}
