'use strict';

class PositiveDecimalIntegerInWords {

    constructor(decimalNumerals) {
        // The constructor stores in this object the positive decimal integer that is required to be converted into words, and throws an exception if there is an error in it.

        this.decimalNumber = parseInt(decimalNumerals, 10);

        if ( ! isNaN(decimalNumerals) && 1 <= this.decimalNumber && this.decimalNumber <= 999999999 ) {
            this.decimalNumerals = decimalNumerals;
        } else {
            if ( isNaN(decimalNumerals) ) {
                exitStatus = exitStatusInvalidParameter;

                throw new Error(`Invalid character in parameter: parameter passed is not a positive decimal integer in the range from 1 to 999999999 inclusive for conversion into words: ${decimalNumerals}`);
            } else {
                exitStatus = exitStatusOutOfRange;

                throw new Error(`Out of range: parameter passed is not a positive decimal integer in the range from 1 to 999999999 inclusive for conversion into words: ${decimalNumerals}`);
            }
        }
    }

    getCharacteristicAndPowerExponent() {
        const self = this;

        const unsetValue = -1;

        let characteristicPowerExponent = { characteristic: unsetValue, powerExponent: unsetValue };
        let powerNotFound = true;
    
        for ( let powerOfTenExponent = 0; powerOfTenExponent < 9 && powerNotFound; powerOfTenExponent++ ) {
            let x = self.decimalNumber / Math.pow(10, powerOfTenExponent);
    
            let xInt = parseInt(x.toString());
    
            if ( 0 <= xInt && xInt < 10 ) {
                characteristicPowerExponent = { characteristic: xInt, powerExponent: powerOfTenExponent };
    
                powerNotFound = false;
            }
        }

        return characteristicPowerExponent;
    } 

    getUnitsWord(characteristic) {
        let unitsWord = '';

        switch (characteristic) {
            case 0:  break;  // return the empty string.

            case 1:  unitsWord = 'one';
                break;

            case 2:  unitsWord = 'two';
                break;

            case 3:  unitsWord = 'three';
                break;

            case 4:  unitsWord = 'four';
                break;

            case 5:  unitsWord = 'five';
                break;

            case 6:  unitsWord = 'six';
                break;

            case 7:  unitsWord = 'seven';
                break;

            case 8:  unitsWord = 'eight';
                break;

            case 9:  unitsWord = 'nine';
                break;
        }

        return unitsWord;
    }

    getTeensWord(characteristic) {
        let teensWord = '';

        switch (characteristic) {
            case 10:  teensWord = 'ten';
                break;
            
            case 11:  teensWord = 'eleven';
                break;
            
            case 12:  teensWord = 'twelve';
                break;
            
            case 13:  teensWord = 'thirteen';
                break;
            
            case 14:  teensWord = 'fourteen';
                break;
            
            case 15:  teensWord = 'fifteen';
                break;
            
            case 16:  teensWord = 'sixteen';
                break;
            
            case 17:  teensWord = 'seventeen';
                break;
            
            case 18:  teensWord = 'eighteen';
                break;
            
            case 19:  teensWord = 'nineteen';
                break;
        }

        return teensWord;
    }

    getTensWord(characteristic) {
        let tensWord = '';

        switch (characteristic) {
            case 2:  tensWord = 'twenty';
                break;
            
            case 3:  tensWord = 'thirty';
                break;
            
            case 4:  tensWord = 'fourty';
                break;
            
            case 5:  tensWord = 'fifty';
                break;
            
            case 6:  tensWord = 'sixty';
                break;
            
            case 7:  tensWord = 'seventy';
                break;
            
            case 8:  tensWord = 'eighty';
                break;
            
            case 9:  tensWord = 'ninety';
                break;
        }

        return tensWord;
    }

    getOrderOfTensWord(tensNumber) {
        const self = this;

        let orderOfTensWords = '';

        const teensRE = /^1/;

        if ( teensRE.test(tensNumber) ) {
            orderOfTensWords = self.getTeensWord(tensNumber);
        } else {
            orderOfTensWords = self.getTensWord(tensNumber);
        }

        return orderOfTensWords;
    }

    toWords() {
        // This is a recursive method for converting a positive decimal integer into its corresponding English words expression.  It is case 0: of the switch statement that
        // will always exit the recursion, or for the other cases only if the residual is zero (0).  All other cases when the residual is non-zero, recursively call this method
        // to deal with the residual positive decimal integers.
        //
        // Remarks:
        //
        // 1) As the hundreds with units will include the word 'and' (i.e. hundreds and units, for example 'one hundred and twelve'), they are dealt with in the 
        //    cases where the powerTenExponent is 5 (hundreds of thousands) or 8 (hundreds of millions) by computing the English words expression, for the hundreds,
        //    separately by a secondary recursive call to this method.  
        //
        // 2) The integers 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800 and 1900 are expressed as 'one thousand, one hundred' and not the more common 'eleven hundred'. 
        //    That is these are the English words for these numbers:
        //
        //      1100 'one thousand, one hundred'
        //      1200 'one thousand, two hundred'
        //      1300 'one thousand, three hundred'
        //      1400 'one thousand, four hundred'
        //      1500 'one thousand, five hundred'
        //      1600 'one thousand, six hundred'
        //      1700 'one thousand, seven hundred'
        //      1800 'one thousand, eight hundred'
        //      1900 'one thousand, nine hundred'
        //
        // 3) The hundreds of thousands and hundreds of millions use a second recursion to express the hundreds in English words.  This is because the hundreds in
        //    English words require the word 'and' when the hundreds have tens and units, tens or units.
        //    For example: 230000 which is 230 * 1000 uses recursion to express 230 as 'two hundred and thirty', resulting in 'two hundred and thirty thousand'.
        //    Example output:
        //
        //    { "decimalInteger": "230000001", "decimalIntegerInWords": "two hundred and thirty million and one" }
        //
        // 4) Example: Express 43570 in English words.
        //      case 4: when the positive decimal integer is in the 40000s
        //              characteristic === 4
        //              firstTwoDigits === 43
        //              residual === 570 (43570 - 43 * 10000)
        //              recursive call passing 570
        //                      case 2: when the positive decimal integer is in the 100s
        //                              characteristic === 5
        //                              residual === 70 (570 - 70)
        //                              recursive call passing 70
        //                              case 1: when the positive decimal integer is in the 10s which terminates recursion and returns string 'seventy' 
        //                      unwinds recursion and returns string 'five hundred and seventy' that is concatenation 'five hundred and ' +  'seventy'
        //      unwinds recursion and returns string 'fourty three thousand, five hundred and seventy' that is concatenation 'fourty three thousand, ' + 'five hundred and seventy'
        //    This terminates the recursion and the final English words expression is 'fourty three thousand, five hundred and seventy'.
        //
        // 5) The output is presented in JSON format.  The JSON format is a standardised format for passing data from one service to another which justifies it as
        //    being the output format used.
        //
        //    Example:
        //    node ./convertDecimalIntegersToWords.js 999999999 999999991 999999901 999999001 999990001 999900001 999000001 990000001 900000001
	//    { "decimalInteger": "999999999", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred and ninety nine thousand, nine hundred and ninety nine" }
	//    { "decimalInteger": "999999991", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred and ninety nine thousand, nine hundred and ninety one" }
	//    { "decimalInteger": "999999901", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred and ninety nine thousand, nine hundred and one" }
	//    { "decimalInteger": "999999001", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred and ninety nine thousand and one" }
	//    { "decimalInteger": "999990001", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred and ninety thousand and one" }
	//    { "decimalInteger": "999900001", "decimalIntegerInWords": "nine hundred and ninety nine million, nine hundred thousand and one" }
	//    { "decimalInteger": "999000001", "decimalIntegerInWords": "nine hundred and ninety nine million and one" }
	//    { "decimalInteger": "990000001", "decimalIntegerInWords": "nine hundred and ninety million and one" }
	//    { "decimalInteger": "900000001", "decimalIntegerInWords": "nine hundred million and one" }

        const self = this;
 
        let numberInWords = '';

        let magnitudePower = self.getCharacteristicAndPowerExponent();
        let characteristic = magnitudePower.characteristic;
        let powerTenExponent = magnitudePower.powerExponent;

        const unsetValue = -1;

        if ( characteristic !== unsetValue && powerTenExponent !== unsetValue ) {
            // The residual variable is used to determine whether there should be a recursion for its positive decimal integer value.  Apart from case 0: of the switch
            // statement, there will be a recursive call for the value of residual if, and only if, the value of residual is non-zero (residual > 0).
            let residual = self.decimalNumber - characteristic * Math.pow(10, powerTenExponent);
    
            // These variables are used in constructing the English words that express the positive decimal integer.
            let firstTwoDigits = '';
            let firstThreeDigits = '';
    
            let tensPositiveDecimalIntegerInWords = '';
            let thousandsPositiveDecimalIntegerInWords = '';
    
            // These are the separators used in the English words to separate the hundreds, thousand and millions from one another and the units.
            const hundredsUnitsSeparator = 'and ';  // Separates the hundreds from the units, or if there are no hundreds, the units from the next highest digit.
            const millionsThousandsSeparator = ', ';  // Separates the millions from the thousands and the thousands from the hundreds.
    
            switch (powerTenExponent) {
    
                case 0:  // This condition when powerTenExponent === 0 exits the recursion.  This case deals with single digit positive decimal integers, that is the units.
                    numberInWords = self.getUnitsWord(characteristic);
                    break;
    
                case 1: // This case processes positive decimal integers in the tens (10s).
                    const tensWord = self.getTensWord(characteristic);

                    if ( characteristic === 1 ) {
                        numberInWords = self.getTeensWord(self.decimalNumber);
                    } else {
                        residual = self.decimalNumber - characteristic * Math.pow(10, powerTenExponent);
                        if ( residual > 0 ) {
                            // The residual decimal integer is dealt with by a recursive call.  In this case the recursion deals with the units which then terminates the recursion.
                            const residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
        
                            numberInWords = tensWord + ' ' + residualInWords;
                        } else {
                            // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                            numberInWords = tensWord;
                        }
                    }
                    break;
    
                case 2: // This case processes positive decimal integers in the hundreds (100s).
                    tensPositiveDecimalIntegerInWords = self.getUnitsWord(characteristic);
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        const residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // Remark: the hundreds are a special cases in that they need the word 'and' to be suffixed before the teens or units in English.
                        numberInWords = `${tensPositiveDecimalIntegerInWords} hundred ${hundredsUnitsSeparator}` + residualInWords;
    
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        const characteristicString = self.getUnitsWord(characteristic);
                        numberInWords = `${characteristicString} hundred`;
                    }
                    break;
    
                case 3: // Similar to case 6:.  This case processes positive decimal integers in the thousands (1000s).
                    thousandsPositiveDecimalIntegerInWords = self.getUnitsWord(characteristic);

                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
                    
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        if ( residual <= 100 || residual % 100 === 0 ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${thousandsPositiveDecimalIntegerInWords} thousand ` + residualInWords;
                        } else {
                            numberInWords = `${thousandsPositiveDecimalIntegerInWords} thousand` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${thousandsPositiveDecimalIntegerInWords} thousand`;
                    }
                    break;
    
                case 4: // Similar to case 7: (hundredsUnitsSeparator).  This case processes positive decimal integers in the tens of thousands (10s of 1000s).
                    firstTwoDigits = self.decimalNumber.toString().substring(0, 2);
                    residual = self.decimalNumber - Number(firstTwoDigits) * Math.pow(10, powerTenExponent - 1);  // Subtracting 1 in the power is the same as division by 10.
                    firstTwoDigits = new PositiveDecimalIntegerInWords(Number(firstTwoDigits)).toWords();
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        numberInWords = `${firstTwoDigits} million` + millionsThousandsSeparator + residualInWords;
                   
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        // The same as for the thousands (1000s) because the residual occurs after the first two digits.
                        if ( residual <= 100 || (residual % 100 === 0 && residual % 1000 !== 0) ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${firstTwoDigits} thousand ` + residualInWords;
                        } else {
                            numberInWords = `${firstTwoDigits} thousand` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${firstTwoDigits} thousand`;
                    }
                    break;
    
                case 5: // Similar to case 8: (recursive call for hundreds).  This case processes positive integers in the hundreds of thousands (100s of 1000s).
                    firstThreeDigits = self.decimalNumber.toString().substring(0, 3);
    
                    residual = self.decimalNumber - Number(firstThreeDigits) * Math.pow(10, powerTenExponent - 2);  // Subtracting 2 in the power is the same as division by 100.
    
                    // The first three digits will be in the hundreds, as this case is for the hundreds of thousands, and this means the word 'and' may have to be included in the words.
                    // The hundreds are dealt with by a recursive call on the first three digits.
                    firstThreeDigits = new PositiveDecimalIntegerInWords(Number(firstThreeDigits)).toWords();
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        // The same as for the thousands (1000s) because the residual occurs after the first three digits.
                        if ( residual <= 100 || (residual % 100 === 0 && residual % 1000 !== 0) ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${firstThreeDigits} thousand ` + residualInWords;
                        } else {
                            numberInWords = `${firstThreeDigits} thousand` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${firstThreeDigits} thousand`;
                    }
                    break;
    
                case 6: // Similar to case 3:.  This case processes positive integers in the millions (1000000s).
                    const millionsPositiveDecimalIntegerInWords = self.getUnitsWord(characteristic);
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        if ( (residual % 100000 === 0 && residual < 1000000) || (residual % 10000 === 0 && residual < 100000) || (residual % 1000 === 0 && residual < 100000) || (residual % 100 === 0 && residual < 1000) || (residual % 10 === 0 && residual < 100) || (residual <= 100) ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${millionsPositiveDecimalIntegerInWords} million ` + residualInWords;
                        } else {
                            numberInWords = `${millionsPositiveDecimalIntegerInWords} million` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${millionsPositiveDecimalIntegerInWords} million`;
                    }
                    break;
    
                case 7: // Similar to case 4: (hundredsUnitsSeparator).  This case processes positive integers in the tens of millions (10s of 1000000s).
                    firstTwoDigits = self.decimalNumber.toString().substring(0, 2);
    
                    residual = self.decimalNumber - Number(firstTwoDigits) * Math.pow(10, powerTenExponent - 1);  // Subtracting 1 in the power is the same as division by 10.
    
                    firstTwoDigits = new PositiveDecimalIntegerInWords(Number(firstTwoDigits)).toWords();
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        if ( (residual % 100000 === 0 && residual < 1000000) || (residual % 10000 === 0 && residual < 100000) || (residual % 1000 === 0 && residual < 100000) || (residual % 100 === 0 && residual < 1000) || (residual % 10 === 0 && residual < 100) || (residual <= 100) ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${firstTwoDigits} million ` + residualInWords;
                        } else {
                            numberInWords = `${firstTwoDigits} million` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${firstTwoDigits} million`;
                    }
                    break;
    
                case 8: // Similar to case 5: (recursive call for hundreds).  This case processes positive integers in the hundreds of millions (100s of 1000000s).
                    const hundredMillionsPositiveDecimalIntegerInWords = self.getUnitsWord(characteristic);
                    firstThreeDigits = self.decimalNumber.toString().substring(0, 3);
    
                    residual = self.decimalNumber - Number(firstThreeDigits) * Math.pow(10, powerTenExponent - 2);  // Subtracting 2 in the power is the same as division by 100.
    
                    // The first three digits will be in the hundreds, as this case is for the hundreds of millions, and this means the word 'and' may have to be included in the words.
                    // The hundreds are dealt with by a recursive call on the first three digits.
                    firstThreeDigits = new PositiveDecimalIntegerInWords(Number(firstThreeDigits)).toWords();
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // This test determines whether the word 'and' is required in the English words for the residual.
                        if ( (residual % 100000 === 0 && residual < 1000000) || (residual % 10000 === 0 && residual < 100000) || (residual % 1000 === 0 && residual < 100000) || (residual % 100 === 0 && residual < 1000) || (residual % 10 === 0 && residual < 100) || (residual <= 100) ) {
                            residualInWords = hundredsUnitsSeparator + residualInWords;     
                            numberInWords = `${firstThreeDigits} million ` + residualInWords;
                        } else {
                            numberInWords = `${firstThreeDigits} million` + millionsThousandsSeparator + residualInWords;
                        }
                    } else {
                        // If the residual is zero, then there are no more non-zero digits in the number, therefore end the recursion.
                        numberInWords = `${firstThreeDigits} million`;
                    }
                    break;
            }
    
        }

        return numberInWords;
    }

}


const exitStatusSuccess = 0;
// These constants are used in the constructor to reset the exit status (variable: exitStatus) to communicate any error in the argument(s) passed to the constructor as its input.
const exitStatusOutOfRange = 1;
const exitStatusInvalidParameter = 2;

let exitStatus = exitStatusSuccess;

if ( process.argv.length > 2 ) {
    // Arguments have been passed, therefore process them.
    const argList = process.argv.slice(2);
    argList.forEach(function(decimalInteger) {
        try {
            const decimalIntegerValue = new PositiveDecimalIntegerInWords(decimalInteger);
            const decimalIntegerInWords = decimalIntegerValue.toWords();
    
            console.log(`{ "decimalInteger": "${decimalInteger}", "decimalIntegerInWords": "${decimalIntegerInWords}" }`);
        }
        catch ( errorParameterMessage ) {
            console.error(errorParameterMessage.message);
        }
    });
} else {
    // Test positive decimal integers.
    const decimalIntegers = [ '115', '115000', '115000000','115', '1151', '115001', '115000001', '230', '230000', '230000000', '231', '230001', '230000001', '115000', '230000', '345000', '460000', '460000000', '575000', '575000000', '1', '11', '111', '1111', '11111', '111111', '1111111', '11111111', '111111111', '99911', '999111', '9991111', '99911111', '999111111', '999', '9999', '11199', '111999', '1119999', '111999999', '333333333' ];
    decimalIntegers.forEach(function(decimalInteger) {
        try {
            const decimalIntegerValue = new PositiveDecimalIntegerInWords(decimalInteger);
            const decimalIntegerInWords = decimalIntegerValue.toWords();
    
            console.log(`{ "decimalInteger": "${decimalInteger}", "decimalIntegerInWords": "${decimalIntegerInWords}" }`);
        }
        catch ( errorParameterMessage ) {
            console.error(errorParameterMessage.message);
        }
    });
}

process.exit(exitStatus);
