/**
 * Inject test data into the prompt.
 *
 * This function injects test variables and test prompts into the application.
 *
 * @return {void}
 */

export function injectTestData(dispatchPrompt, storeVariable) {
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
		'10 input "What is your name?"; N$',
		'20 print "Hello"; N$; ". Welcome to Basic V2!"',
		'30 print "--------"',
	];

	// inject test prompts
	if (typeof testPrompts !== 'undefined' && testPrompts.length) {
		for (let i = 0; i < testPrompts.length; i++) {
			dispatchPrompt(testPrompts[i]);
		}
	}

	// inject test variables
	if (
		typeof testVariables !== 'undefined' &&
		Object.keys(testVariables).length
	) {
		for (let index in testVariables) {
			storeVariable(index, testVariables[index]);
		}
	}
}
