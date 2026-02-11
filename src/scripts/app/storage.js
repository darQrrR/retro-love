export let promptStorage = [];
export let variableStorage = [];

// store prompt
export const storePrompt = (prompt) => {
  // if linenumer already exists -> remove
  const exists = promptStorage.findIndex(
    (obj) => obj.lineNumber === prompt.lineNumber,
  );
  if (exists !== -1) promptStorage.splice(exists, 1);

  // push and sort new prompt
  promptStorage.push(prompt);
  promptStorage.sort((a, b) => a.lineNumber - b.lineNumber);
};

// store variable
export const storeVariable = (name, value) => {
  variableStorage[name] = value;
};

export const clearPromptStorage = () => {
  promptStorage = [];
};

export const clearVariableStorage = () => {
  variableStorage = [];
};

export const clearAllStorage = () => {
  promptStorage = [];
  variableStorage = [];
};
