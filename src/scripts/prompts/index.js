import { promptRun } from './flow.js';
import { promptGoto } from './flow.js';
import { promptInput } from './input.js';
import { promptPrint } from './output.js';
import { promptExit } from './system.js';
import { promptClr } from './system.js';
import { promptList } from './system.js';

export const commands = [
	{ cmd: 'print', para: 1, func: promptPrint }, // print string
	{ cmd: 'goto', para: 1, func: promptGoto }, // jump to line
	{ cmd: 'input', para: 1, func: promptInput }, // input string
	{ cmd: 'exit', para: 0, func: promptExit }, // exit program
	{ cmd: 'clr', para: 0, func: promptClr }, // clear screen
	{ cmd: 'run', para: 0, func: promptRun }, // run stored prompts
	{ cmd: 'list', para: 1, func: promptList }, // list stored prompts
];
