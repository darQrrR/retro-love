import { commandTypes } from '../app/constants.js';
import * as storage from '../app/storage.js';

export async function GOTO(lineNumber) {
  const targetLineNumber = Number(lineNumber);
  const targetLine = storage.commandStorage.findIndex((obj) => obj.lineNumber === targetLineNumber);

  if (targetLine === -1) return { type: commandTypes.ERROR, value: null };
  return { type: commandTypes.GOTO, value: targetLine };
}
