const AudioContext = window.AudioContext;
const context = new AudioContext();
const dotDuration = 1.2 / 15;
const dashDuration = 3 * dotDuration;
const spaceDuration = 7 * dotDuration;

document.addEventListener('DOMContentLoaded', (e) => {
    runMorseRepeater();
});

const runMorseRepeater = () => {
    const code = '.-'; // A
    let t = context.currentTime;

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 440; // or 600

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, t);

    let totalDuration;
    code.split("").forEach(function (letter) {
        switch (letter) {
            case ".":
                gainNode.gain.setValueAtTime(1, t);
                t += dotDuration;
                gainNode.gain.setValueAtTime(0, t);
                t += dotDuration;
                break;
            case "-":
                gainNode.gain.setValueAtTime(1, t);
                t += dashDuration;
                gainNode.gain.setValueAtTime(0, t);
                t += dotDuration;
                break;
            case " ":
                t += spaceDuration;
                break;
        }
    });

    const source = context.createBufferSource();
    //connect it to the destination so you can hear it.
    source.connect(context.destination);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();

    setTimeout(runMorseRepeater, t);
}


