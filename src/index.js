
import { merge } from './observable.js';
import { scan, bufferQueue, filter, map, pairwise } from './operators.js';
import { watchPosition } from './geolocation.js';

const getDebugMessageElement = () => document.getElementById('debugMessage');
const setDebugMessage = (message) => getDebugMessageElement().innerText = message;
const getDebugMessage = () => getDebugMessageElement().innerText;
const appendDebugMessage = (message) => {
    setDebugMessage(getDebugMessage() + message + '\n');
}

const getTapElement = () => document.getElementById('tapper');
const setMessage = (message) => getTapElement().innerText = message;

const createInstance = () => {
    setMessage('Walk');

    const position$ = watchPosition();
    const distance$ = position$.pipe(
        filter(position => position.speed !== null),
        map((position) => {
            const { speed, timestamp } = position;
            return {
                speed,
                timestamp,
            };
        }),
        pairwise(),
        map(([later, earlier]) => {
            const intervalMs = later.timestamp - earlier.timestamp;
            const distance = later.speed * intervalMs / 1000;
            return distance;
        }),
    );
    const sum = (a, b) => a + b;
    const cumulativeDistanceFt$ = distance$.pipe(
        scan(sum, 0),
        map(distance => metersToFeet(distance)),
    );

    const average = values => values.reduce((acc, d) => acc + d) / values.length;
    const metersPerSecondToMilesPerHour = speed => speed * 2.23694;
    const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

    const averageSpeedMph$ = position$.pipe(
        map(({ speed }) => speed),
        filter(speed => speed !== null),
        bufferQueue(5),
        map(speeds => average(speeds)),
        map(metersPerSecondToMilesPerHour),
    );

    const metersToFeet = meters => meters * 3.28084;
    const mergedMessages$ = merge(
        averageSpeedMph$.pipe(map(speed => ({ speed }))),
        cumulativeDistanceFt$.pipe(map(distance => ({ distance }))),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
    );

    mergedMessages$.subscribe(({ speed, distance }) => {
        setMessage(formatter.format(speed) + 'mph' + '\n' + formatter.format(distance) + 'ft');
    }, error => {
        setDebugMessage(error);
    });
}

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
    .then(() => navigator.permissions.query({ name: 'geolocation' }))
    .then(() => createInstance())
    .catch(e => setMessage(e.message + '\n' + e.stack));
