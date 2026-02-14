import { commandTypes } from '../app/constants.js';

export async function IF(args) {
  return { type: commandTypes.DEFAULT, value: null };
}
