import { programState } from '../app/state.js';
import { inputModes } from '../app/constants.js';

import { dispatcher } from '../app/dispatcher.js';

function createEventListeners() {
  function addEventListeners(dom) {
    const { input } = dom;

    // move cursor on input
    //TODO: blinking cursor movement with arrow-keys
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
    // TODO: remove syntax error on empty enter
    const keysDown = [];
    input.addEventListener('keydown', (e) => {
      const key = e.key;

      if (!programState.isInputEnabled) {
        e.preventDefault();

        // handle pressed keys
        if (keysDown.indexOf(e.key) === -1) {
          keysDown.push(e.key);
        }

        if (keysDown.length > 1 && keysDown.includes('c') && keysDown.includes('Control')) {
          programState.abortProgram = true;
        }

        return;
      }

      if (key === 'Enter' && programState.activeInputMode === inputModes.PROMPT) {
        const inputValue = input.value.toLowerCase().trim();
        dom.clearInput();
        dom.outputLine(inputValue);
        dispatcher.dispatchCommand(inputValue);
        return;
      }
    });

    input.addEventListener('keyup', (e) => {
      const index = keysDown.indexOf(e.key);

      if (index !== -1) {
        keysDown.splice(index, 1);
      }
    });
  }

  return { addEventListeners };
}

export const eventListeners = createEventListeners();
