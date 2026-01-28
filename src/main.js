// import scss structure
import './styles/main.scss';

// import js structure
import './scripts/app.js';
import { tokenize } from './scripts/utils/strings.js';

const command = '"HELLO " + "WORLD"; A + 2.1; 40 + 2 4 * 3; C$; A, B, D%';

const variables = {
	A: 123,
	AB: 9,
	B: 2,
	C: 3,
	C$: 'TEST',
	'D%': 3.1415,
};

console.log(tokenize(command, variables));
