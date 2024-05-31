import { glob } from 'node:fs';
import { execFileSync } from 'node:child_process';

// glob('src/**/*', null, function (err, matches) {
//     matches.forEach(function (match) {
//         spawn('node', match);
//     });
// })

const runNodeFile = (file) => {
    try {
        const stdout = execFileSync('node', [file], {
            // Capture stdout and stderr from child process. Overrides the
            // default behavior of streaming child stderr to the parent stderr
            stdio: 'pipe',

            // Use utf8 encoding for stdio pipes
            encoding: 'utf8',
        });

        console.log(stdout);
    } catch (err) {
        if (err.code) {
            // Spawning child process failed
            console.error(err.code);
        } else {
            // Child was spawned but exited with non-zero exit code
            // Error contains any stdout and stderr from the child
            const { stdout, stderr } = err;

            console.error({ stdout, stderr });
        }
    }
}

glob('**/*.node.js', (err, matches) => {
    if (err) throw err;

    matches.forEach(function (match) {
        runNodeFile(match)
    });
});
