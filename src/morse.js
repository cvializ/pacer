const { zip, from } = window.rxjs;
const { last, map, scan } = window.rxjs.operators;

const fromArray = (arr) => from(arr);

const BEAT_TIME_SECONDS = 1 / 5;

const REPEAT_COUNT = 1000; // gives 1 hour playtime


// const a$ = from('X XX  X XX  X XX  ').pipe(repeat(REPEAT_COUNT));
// const n$ = from(' X  XX X  XX X  XX').pipe(repeat(REPEAT_COUNT));
const a$ = fromArray('X XX  X XX  X XX  '.repeat(REPEAT_COUNT).split(''));
const n$ = fromArray(' X  XX X  XX X  XX'.repeat(REPEAT_COUNT).split(''));

const isWhitespace = value => !/\w/.test(value); // \s doesn't match empty string

const aGain$ = a$.pipe(
    map(char => isWhitespace(char) ? 0 : 1),
);

const nGain$ = n$.pipe(
    map(char => isWhitespace(char) ? 0 : 1),
);

const aTime$ = a$.pipe(
    map(() => BEAT_TIME_SECONDS),
    scan((acc, d) => (acc * 10 + d * 10) / 10, 0), // floating point math https://www.codemag.com/article/1811041/JavaScript-Corner-Math-and-the-Pitfalls-of-Floating-Point-Numbers
);

const nTime$ = n$.pipe(
    map(() => BEAT_TIME_SECONDS),
    scan((acc, d) => (acc * 10 + d * 10) / 10), // floating point math https://www.codemag.com/article/1811041/JavaScript-Corner-Math-and-the-Pitfalls-of-Floating-Point-Numbers
);

const aNodeValue$ = zip(aGain$, aTime$);
const nNodeValue$ = zip(nGain$, nTime$);

const last$ = aTime$.pipe(last());

export const runMorseRepeater = (averageSpeed$) => {
    const AudioContext = globalThis.AudioContext;
    const context = new AudioContext();

    const initialTime = context.currentTime;

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 440; // or 600

    const volumeGainNodeA = context.createGain();
    volumeGainNodeA.gain.setValueAtTime(1, initialTime);

    const codeGainNodeA = context.createGain();
    aNodeValue$.subscribe(([value, time]) => {
        // It's only calling this once...
        codeGainNodeA.gain.setValueAtTime(value, initialTime + time);
    });

    const volumeGainNodeN = context.createGain();
    volumeGainNodeN.gain.setValueAtTime(0, initialTime);

    const codeGainNodeN = context.createGain();
    nNodeValue$.subscribe(([value, time]) => {
        codeGainNodeN.gain.setValueAtTime(value, initialTime + time);
    });

    oscillator.connect(codeGainNodeA)
    codeGainNodeA.connect(volumeGainNodeA);
    volumeGainNodeA.connect(context.destination);

    oscillator.connect(codeGainNodeN);
    codeGainNodeN.connect(volumeGainNodeN);
    volumeGainNodeN.connect(context.destination);

    oscillator.start(0);

    const SPEED_TARGET = 5;
    const SPEED_RANGE = 3; // 3 above, 3 below

    averageSpeed$.pipe(
        map((speed) => speed - SPEED_TARGET),
        map(difference => difference / SPEED_RANGE),
        map(ratio => Math.max(-1, Math.min(ratio, 1))),
        map(clamped => .5 + clamped * .5),
    ).subscribe((normalizedValue) => {
        const { currentTime } = context
        const aValue = normalizedValue;
        const nValue = 1 - normalizedValue;
        volumeGainNodeA.gain.setValueAtTime(aValue, currentTime);
        volumeGainNodeN.gain.setValueAtTime(nValue, currentTime);
    });

    last$.subscribe(lastTimeSeconds => {
        oscillator.stop(initialTime + lastTimeSeconds);
    });
}
