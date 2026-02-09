import { RUN } from './flow.js';
import { GOTO } from './flow.js';
import { IF } from './flow.js';
import { INPUT } from './input.js';
import { PRINT } from './output.js';
import { LIST } from './output.js';
import { CLR } from './system.js';
import { EXIT } from './system.js';

export const commands = [
	{ cmd: 'run', para: 0, func: RUN }, // run stored prompts
	{ cmd: 'goto', para: 1, func: GOTO }, // jump to line
	{ cmd: 'if', para: 1, func: IF }, // if statement
	{ cmd: 'input', para: 1, func: INPUT }, // input string
	{ cmd: 'print', para: 1, func: PRINT }, // print string
	{ cmd: 'list', para: 0, func: LIST }, // list stored prompts
	{ cmd: 'clr', para: 0, func: CLR }, // clear screen
	{ cmd: 'exit', para: 0, func: EXIT }, // exit program
];
