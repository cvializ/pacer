import { runMorseRepeater } from './morse.js';
import { createInstance } from './pacer.js';
import { getTapElement } from './tapper.js';

const onReadyPromise = new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', resolve);
});

const clickPromise = new Promise(resolve => {
    document.addEventListener('click', (e) => {
        if (e.target !== getTapElement()) {
            return;
        }

        resolve();
    });
});

onReadyPromise
    .then(() => clickPromise)
    .then(() => createInstance());
    // .catch(e => setMessage(e.message + '\n' + e.stack));
