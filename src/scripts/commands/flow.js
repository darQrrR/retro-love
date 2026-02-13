import * as storage from '../app/storage.js';
import { commandTypes, inputModes } from '../app/constants.js';
import { programState } from '../app/state.js';
import { dom } from '../ui/dom.js';
import { waitForUserInput } from './input.js';

// debounce
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function RUN() {
  if (!storage.commandStorage.length) return;

  const numPrompts = storage.commandStorage.length;
  programState.isInputEnabled = false;

  for (let i = 0; i < numPrompts; i++) {
    const answer = await storage.commandStorage[i].fn(storage.commandStorage[i].args);
    let sleepTime = 100;

    dom.clearInput();

    // check if abort was pressed
    if (programState.abortProgram) {
      programState.abortProgram = false;
      programState.isInputEnabled = true;
      return;
    }

    // check if error was thrown
    if (answer.type === commandTypes.ERROR) {
      programState.isInputEnabled = true;
      dom.outputLine('?Syntax Error');
      return;
    }

    // execute GOTO
    if (answer.type === commandTypes.GOTO) {
      i = answer.value - 1;
      sleepTime = 0;
    }

    // execute INPUT
    if (answer.type === commandTypes.INPUT) {
      programState.activeInputMode = inputModes.INPUTVAR;
      programState.isInputEnabled = true;

      for (let j = 0; j < answer.value.length; j++) {
        await waitForUserInput(answer.value[j].value)
          .then((value) => {})
          .catch((err) => {
            j--;
          });
      }

      programState.activeInputMode = inputModes.PROMPT;
      programState.isInputEnabled = false;
    }

    // add delay
    if (i < numPrompts - 1) await sleep(sleepTime);
  }

  programState.isInputEnabled = true;
  return;
}

export async function GOTO(lineNumber) {
  const targetLineNumber = Number(lineNumber);
  const targetLine = storage.commandStorage.findIndex((obj) => obj.lineNumber === targetLineNumber);

  if (targetLine === -1) return { type: commandTypes.ERROR, value: null };
  return { type: commandTypes.GOTO, value: targetLine };
}

export async function IF(args) {
  return { type: commandTypes.DEFAULT, value: null };
}
