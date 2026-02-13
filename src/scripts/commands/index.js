import { RUN } from './flow.js';
import { GOTO } from './flow.js';
import { IF } from './flow.js';
import { INPUT } from './input.js';
import { PRINT } from './output.js';
import { LIST } from './output.js';
import { CLR } from './system.js';
import { REM } from './system.js';
import { EXIT } from './system.js';

export const commands = {
  run: { args: 0, fn: RUN }, // run stored prompts
  goto: { args: 1, fn: GOTO }, // jump to line
  if: { args: 1, fn: IF }, // if statement
  input: { args: 1, fn: INPUT }, // input string
  print: { args: 1, fn: PRINT }, // print string
  list: { args: 0, fn: LIST }, // list stored prompts
  clr: { args: 0, fn: CLR }, // clear screen
  rem: { args: 1, fn: REM }, // comment
  exit: { args: 0, fn: EXIT }, // exit program
};
