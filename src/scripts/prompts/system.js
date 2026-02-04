export async function promptList(start = 0, end = 0) {
	promptStorage.forEach(prompt => {
		console.log(prompt);
	});
}

export async function promptClr() {
	output.textContent = ``;
	output.style.height = '0px';
	clearInput();

	return { type: commandReturns.DEFAULT, value: null };
}

export async function promptExit() {
	return;
}
