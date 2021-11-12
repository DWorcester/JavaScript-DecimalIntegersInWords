const convertDecimalIntegersToWords = require('./convertDecimalIntegersToWords');

let positiveIntegersList = [];

if ( process.argv.length > 2 ) {
    // Arguments have been passed, therefore process them.
    positiveIntegersList = process.argv.slice(2);
} else {
    //positiveIntegersList = 999999991;
    positiveIntegersList = [ 999999991, 999999901, 999999001, 999900001 ];
}

const positiveIntegersInWords = convertDecimalIntegersToWords(positiveIntegersList);

positiveIntegersInWords.forEach( positiveIntegerInWords => {
    console.log(positiveIntegerInWords);
});
