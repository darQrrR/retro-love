import * as storage from '../app/storage.js';
import { dispatcher } from '../commands/dispatcher.js';

export function injectTestData() {
  const testVariables = {
    A: 123,
    AB: 9,
    B: 2,
    C: 3,
    C$: 'STRING',
    'D%': 3.1415,
  };

  const testPrompts = [
    //'10 print "HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%',
    //'20 print "--------"',
    //'30 goto 10',

    '10 input "What is your name?"; A, B$',
    '20 print "Hello"; A; B$; ". Welcome to Basic V2!"',
    '30 rem This is a comment',
    '40 print "--------"',
    '50 goto 10',
  ];

  // inject test prompts
  if (typeof testPrompts !== 'undefined' && testPrompts.length) {
    for (let i = 0; i < testPrompts.length; i++) {
      dispatcher.dispatchCommand(testPrompts[i]);
    }
  }

  // inject test variables
  if (typeof testVariables !== 'undefined' && Object.keys(testVariables).length) {
    for (let index in testVariables) {
      storage.storeVariable(index, testVariables[index]);
    }
  }
}
