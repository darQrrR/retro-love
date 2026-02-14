import { commandTypes } from '../app/constants.js';

export async function REM(message) {
  return { type: commandTypes.DEFAULT, value: null };
}
