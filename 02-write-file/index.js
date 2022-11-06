const fs = require('fs');
const path = require('path');
const { stdin: input, stdout, stdin } = require('process');
const readline = require('readline');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write("Please input your text:\n");

const rl = readline.createInterface({input});

rl.on('line', (input) => {
    if (input == 'exit') {
        stdout.write('Goodbye!');
        rl.close();
    } else {
        output.write(input);
        output.write('\n');
    }
});

process.on('SIGINT', () => {
    stdout.write('Goodbye!');
    rl.close();
});