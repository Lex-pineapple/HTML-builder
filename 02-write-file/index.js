const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const outputPath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(outputPath);
fs.writeFile(outputPath, '', (err) => {
    if (err) console.log(err);
});
output.write("Please input your text:\n");

const rl = readline.createInterface({input});

rl.on('line', (input) => {
    if (input == 'exit') {
        output.write('Goodbye!');
        rl.close();
    } else {
        fs.appendFile(outputPath, (input + '\n'), (err) => {
            if (err) console.log(err);
        })
    }
});

process.on('SIGINT', () => {
    output.write('Goodbye!');
    rl.close();
});
