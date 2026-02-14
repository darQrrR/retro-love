import { commandTypes } from '../app/constants.js';
import * as storage from '../app/storage.js';
import { dom } from '../ui/dom.js';

export async function LIST() {
  // TODO: list prompts of range, e.g. LIST 30,80
  storage.commandStorage.forEach((prompt) => {
    dom.outputLine(`${prompt.lineNumber} ${prompt.fn.name} ${prompt.args}`);
  });

  return { type: commandTypes.DEFAULT, value: null };
}
