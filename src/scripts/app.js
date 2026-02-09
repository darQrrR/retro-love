/** C=64 Basic V2 Interpreter **/
import { dom } from './ui/dom.js';
import { eventListeners } from './ui/eventListeners.js';
import { injectTestData } from './tests/injectTestData.js';

eventListeners.addEventListeners(dom);
dom.outputLine(`Ready.`);

// TODO: only run in dev -> if (import.meta.env.DEV) injectTestData(dispatchPrompt, storage.storeVariable);
injectTestData();
