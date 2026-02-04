/** C=64 Basic V2 Interpreter **/

import { runtime, inputModes } from './app/state.js';
import { getDom } from './ui/dom.js';
import { bindEvents } from './ui/events.js';
import { createActions } from './ui/actions.js';
import { createDispatcher } from './core/dispatcher.js';
import { commands } from './prompts/index.js';

import { injectTestData } from './tests/injectTestData.js';
import * as storage from './app/storage.js';

const dom = getDom();
const actions = createActions(dom);
const dispatcher = createDispatcher({ actions, commands });
const state = { runtime, inputModes };

const ctx = { dom, actions, state, dispatcher };
bindEvents(ctx);

actions.outputLine(`Ready`);

// TODO: only run in dev -> if (import.meta.env.DEV) injectTestData(dispatchPrompt, storage.storeVariable);
//injectTestData(dispatcher.dispatchPrompt, storage.storeVariable);
