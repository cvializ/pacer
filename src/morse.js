import * as rxjs from 'rxjs';

const { from, map, scan, zip } = rxjs;

const n$ = from('XX X  XX X  XX X  ');
const a$ = from('  X XX  X XX  X XX');

const pair$ = zip(n$, a$);

pair$.pipe(

).subscribe((value) => {
    console.log(value);
})

const BEAT_TIME_SECONDS = 1 / 5;

const isWhitespace = value => !/\w/.test(value); // \s doesn't match empty string

const aGain$ = a$.pipe(
    map(char => isWhitespace(char) ? 0 : 1)
);

const nGain$ = n$.pipe(
    map(char => isWhitespace(char) ? 0 : 1)
);

const time$ = a$.pipe(
    map(() => BEAT_TIME_SECONDS),
    scan((acc, d) => (acc * 10 + d * 10) / 10), // floating point math https://www.codemag.com/article/1811041/JavaScript-Corner-Math-and-the-Pitfalls-of-Floating-Point-Numbers
)

zip(n$, time$).subscribe(value => console.log(value));

const aNodeValue$ = zip(aGain$, time$);
const nNodeValue$ = zip(nGain$, time$);

// // gainNode$ = ({ gain: noop });
// const foo$ = merge(
//     n$.pipe(
//         mergeMap(value => fromArray(value.split(''))),
//         wrapWithKey('n'),
//     ),
//     a$.pipe(
//         mergeMap(value => fromArray(value.split(''))),
//         wrapWithKey('a'),
//     ),
// ).pipe(
//     scan((acc, d) => ({ ...acc, ...d })),
// )

// foo$.subscribe(({ n, a }) => {
//     console.log(n, a)
//     // gainNode.gain.setValueAtTime(0, t);
// }, noop, noop);

const runMorseRepeater = () => {
    const AudioContext = globalThis.AudioContext;
    const context = new AudioContext();

    // const code = '.-'; // A
    let initialTime = context.currentTime;

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 440; // or 600

    const gainNodeA = context.createGain();
    aNodeValue$.subscribe(([value, time]) => {
        gainNodeA.gain.setValueAtTime(value, initialTime + time);
    });

    const gainNodeN = context.createGain();
    nNodeValue$.subscribe(([value, time]) => {
        gainNodeN.gain.setValueAtTime(value, initialTime + time);
    });
    // gainNodeA.gain.setValueAtTime(0, t);

    // let totalDuration;
    // code.split("").forEach(function (letter) {
    //     switch (letter) {
    //         case ".":
    //             gainNode.gain.setValueAtTime(1, t);
    //             t += dotDuration;
    //             gainNode.gain.setValueAtTime(0, t);
    //             t += dotDuration;
    //             break;
    //         case "-":
    //             gainNode.gain.setValueAtTime(1, t);
    //             t += dashDuration;
    //             gainNode.gain.setValueAtTime(0, t);
    //             t += dotDuration;
    //             break;
    //         case " ":
    //             t += spaceDuration;
    //             break;
    //     }
    // });

    const source = context.createBufferSource();
    //connect it to the destination so you can hear it.
    source.connect(context.destination);

    oscillator.connect(gainNodeA);
    gainNodeA.connect(context.destination);

    oscillator.connect(gainNodeN);
    gainNodeN.connect(context.destination);


    oscillator.start();

    // setTimeout(runMorseRepeater, t);
}
runMorseRepeater();
