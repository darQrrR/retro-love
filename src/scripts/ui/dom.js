function createDom() {
  let input = document.querySelector('.input');
  let output = document.querySelector('.output');

  function outputLine(value) {
    output.textContent += `\n${value}`;
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    output.textContent = ``;
  }

  function clearInput() {
    input.value = '';
    input.style.width = '0px';
  }

  function resetInput(ready = false) {
    if (ready) outputLine(`\nReady.`);
  }

  return { input, output, outputLine, clearInput, clearOutput, resetInput };
}

export const dom = createDom();
