const lettersRegex = /^[a-zA-Z]+$/;
const badwordsArray = require('badwords/array').filter((word) => lettersRegex.test(word));
const levenshtein = require('js-levenshtein');
const readline = require('readline');
const words = require('an-array-of-english-words');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * @description Attempt to convert strings with asterisks or other symbols to naughty words or words from an English dictionary.
 * @param {string} input
 * @param {number} threshold
 */
function makeWordsNaughtyAgain(input, threshold = 2) {
    const length = input.length;
    const wordMin = length - Math.max(threshold / 2);
    const wordMax = length + Math.max(threshold / 2);
    if (!length || Boolean(lettersRegex.test(input))) return input;
    let lowestDistance = length;

    // pare down the list
    const dictionary = [...words, ...badwordsArray].filter(
        (word) => word.length <= wordMax && word.length >= wordMin
    );

    let output = input;
    let index = 0;

    while (lowestDistance > 0 && index <= dictionary.length && dictionary.length) {
        const currentWord = dictionary[index] || '';
        const currentDistance = levenshtein(currentWord, input);

        if (currentDistance <= lowestDistance) {
            lowestDistance = currentDistance;
            output = currentWord;
        }
        index++;
    }
    return lowestDistance < threshold ? output : input;
}

rl.question('Enter a word\n', function (input) {
    console.log(input, ' --> ', makeWordsNaughtyAgain(input));
    rl.close();
});
