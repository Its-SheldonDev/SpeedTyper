import chalk from 'chalk' 
import fs from 'fs'
import hideCursor from 'hide-terminal-cursor'
import keypress from 'keypress'

const wordList = [];
try {
  const data = fs.readFileSync('wordlist_en.txt', 'UTF-8');
  const words = data.split(/\r?\n/);
  words.forEach((word) => {
    wordList.push(word);
  });
} catch (err) {
  console.error(err);
}

const warning = chalk.hex('#FFA500');
const success = chalk.bold.green;
const underline = chalk.underline;

let textToType = '';
let letterPosition = 0;
let typedText = '';
const displayText = [];
let startTime, endTime;
let startedTyping = false;
let errorCount = 0;

function start() {
  startTime = performance.now();
}

function end() {
  endTime = performance.now();
  const timeDiff = endTime - startTime;
  const seconds = timeDiff / 1000;
  return seconds;
}

function displayArray(textArray) {
  const textToDisplay = textArray.join('');
  console.log('\x1B[1A\x1B[K' + textToDisplay);
}

for (let i = 0; i < 15; i++) {
  textToType += wordList[Math.floor(Math.random() * wordList.length)] + ' ';
}
textToType += wordList[Math.floor(Math.random() * wordList.length)];

displayText.push(underline(textToType[0]));
for (let i = 1; i < textToType.length; i++) {
  displayText.push(textToType[i]);
}

hideCursor();

console.log('\x1B[1A\x1B[KPress a key to start the timer');
displayArray(displayText);

keypress(process.stdin);

process.stdin.on('keypress', (_, key) => {
  if (!startedTyping) {
    start();
    startedTyping = true;
  }

  if (key && key.ctrl && key.name === 'c') {
    // Si l'utilisateur appuie sur Ctrl+C, quitter le programme
    process.exit();
  }

  if (textToType[letterPosition] === key.sequence) {
    displayText[letterPosition] = success(key.sequence);
    typedText += key.sequence;

    if (letterPosition < textToType.length - 1) {
      letterPosition++;
      displayText[letterPosition] = underline(displayText[letterPosition]);
    }
  } else {
    displayText[letterPosition] = underline(warning(textToType[letterPosition]));
    errorCount++;
  }

  displayArray(displayText);

  if (typedText === textToType) {
    process.stdin.pause();
    const finalTime = end();

    console.log(warning('* TIME ELAPSED: ') + success(finalTime) + ' seconds');
    console.log(warning('* WPM: ') + success((textToType.length / 5) / (finalTime / 60)));
    console.log(warning('* Errors: ') + success(errorCount));
    console.log(success('Made with <3 by ') + warning('$heldon_#1705'));

    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
