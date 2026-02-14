import { commandTypes } from '../app/constants.js';
import * as storage from '../app/storage.js';
import { dom } from '../ui/dom.js';
import * as strings from '../../scripts/utils/strings.js';

export async function PRINT(args) {
  if (args) {
    const tokens = strings.tokenize(args);
    const resolved = strings.substituteVariables(tokens, storage.variableStorage);
    const parsed = strings.parse(resolved);
    dom.outputLine(parsed);
  }

  return { type: commandTypes.DEFAULT, value: null };
}
