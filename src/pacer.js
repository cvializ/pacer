import { merge } from './observable.js';
import { scan, bufferQueue, filter, map, pairwise, tap } from './operators.js';
import { getGeolocationPermission, watchPosition } from './geolocation.js';
import { setMessage } from './tapper.js';
import { createPollStream } from './pollStream.js';
import { setBackgroundColor } from './background.js';

const getDebugMessageElement = () => document.getElementById('debugMessage');
const setDebugMessage = (message) => getDebugMessageElement().innerText = message;
const getDebugMessage = () => getDebugMessageElement().innerText;

const run = () => {
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
    const footFormatter = new Intl.NumberFormat("en-US", {
        style: 'unit',
        unit: 'foot',
        maximumFractionDigits: 0,
    });
    const metersToFeet = meters => meters * 3.28084;
    const formatDistance = value => footFormatter.format(value);
    const cumulativeDistanceFtFormatted$ = distance$.pipe(
        scan(sum, 0),
        map(metersToFeet),
        map(formatDistance),
    );

    const average = values => values.reduce((acc, d) => acc + d) / values.length;
    const metersPerSecondToMilesPerHour = speed => speed * 2.23694;
    const mphFormatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
        style: 'unit',
        unit: 'mile-per-hour',
    });
    const formatMph = (value) => mphFormatter.format(value)
    // const averageSpeed$ = position$.pipe(
    //     map(({ speed }) => speed),
    //     filter(speed => speed !== null),
    //     bufferQueue(5),
    //     map(average),
    //     map(metersPerSecondToMilesPerHour),
    // );

    const averageSpeed$ = createPollStream('/inputs/averageSpeed.json').pipe(
        map(value => value.averageSpeed),
    );

    const clamp = (start, end, value) => {
        const range = [start, end];
        const spread = range[1] - range[0];
        const normalizedDifference = Math.min(Math.max(range[0], value), range[1]) / spread;
        return normalizedDifference;
    }

    const toStatusColor = (normalizedValue) => {
        if (normalizedValue > .95) {
            return 'green';
        }

        if (normalizedValue > .75) {
            return 'yellow';
        }

        return 'red';
    }

    const targetSpeed = 3;

    averageSpeed$.pipe(
        map(speed => targetSpeed - speed),
        map(value => clamp(0, 3, value)),
        map(value => 1 - value),
        map(value => toStatusColor(value)),
    ).subscribe(color => {
        setBackgroundColor(color)
    });

    const averageSpeedFormatted$ = averageSpeed$.pipe(map(formatMph));
    const mergedMessages$ = merge(
        averageSpeedFormatted$.pipe(map(speed => ({ speed }))),
        cumulativeDistanceFtFormatted$.pipe(map(distance => ({ distance }))),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
    );

    mergedMessages$.subscribe(({ speed, distance }) => {
        setMessage(`${speed}\n${distance}`);
    }, error => {
        setDebugMessage(error);
    });
};

export const createInstance = () => {
    return getGeolocationPermission()
        .then(({ state }) => {
            // if (state === 'denied') {
            //     return Promise.reject();
            // }
            return Promise.resolve();
        })
        .then(() => run());
}
