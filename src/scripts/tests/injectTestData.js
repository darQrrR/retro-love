import * as storage from '../app/storage.js';
import { dispatcher } from '../prompts/dispatcher.js';

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
    '5 input "What is your name?"; N$',
    //'20 print "Hello"; N$; ". Welcome to Basic V2!"',
    //'30 print "--------"',
    //'40 goto 10',
    '10 rem This is a comment',
    '20 print "HELLO" ',
    '30 print N$',
    '40 print "--------"',
  ];

  // inject test prompts
  if (typeof testPrompts !== 'undefined' && testPrompts.length) {
    for (let i = 0; i < testPrompts.length; i++) {
      dispatcher.dispatchPrompt(testPrompts[i]);
    }
  }

  // inject test variables
  if (
    typeof testVariables !== 'undefined' &&
    Object.keys(testVariables).length
  ) {
    for (let index in testVariables) {
      storage.storeVariable(index, testVariables[index]);
    }
  }
}
