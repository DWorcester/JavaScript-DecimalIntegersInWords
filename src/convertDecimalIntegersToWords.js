'use strict';

class PositiveDecimalIntegerInWords {

    constructor(decimalNumerals) {
        // The constructor stores in this object the positive decimal integer that is required to be converted into words, and throws an exception if there is an error in it.

        // This pattern will identify positive decimal integers that are expressed in the exponential E notation, as identified by the presence of e or E.
        const numberInENotation = /[0-9]+[Ee][0-9]+/;

        // Firstly, test the potential positive decimal integer is a valid number format.  The exceptions thrown result in error messages as follows being output:
        //      Number is not an integer: parameter passed is not a whole number as it has a fractional part: 99.88
        //      Invalid non-numerical character in parameter: parameter passed is not a positive decimal integer because it contains a character that is not a digit: 99r123
        if ( ! isNaN(decimalNumerals) && Number.isInteger(Number(decimalNumerals)) ) {
            this.decimalNumber = parseInt(decimalNumerals, 10);
        } else {
            if ( isNaN(decimalNumerals) ) {
                //exitStatus = exitStatusNotANumber;

                throw new Error(`Invalid non-numerical character in parameter: parameter passed is not a positive decimal integer because it contains a character that is not a digit: ${decimalNumerals}`);
            } else {
                //exitStatus = exitStatusNotInteger;
                
                throw new Error(`Number is not an integer: parameter passed is not a whole number as it has a fractional part: ${decimalNumerals}`);
            }
        }

        // Secondly, test that the positive decimal integer is not in exponential format (e.g. 999E3 === 999000 or 999e3 === 999000) and that it is in the required range.
        // The exceptions thrown result in error messages as follows being output:
        //      Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: 999E3
        //      Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: 1000e3
        //      Out of range: parameter passed is not a positive decimal integer in the range from 1 to 999999999 inclusive for conversion into English words: 999888777666
        if ( ! numberInENotation.test(decimalNumerals) && 1 <= this.decimalNumber && this.decimalNumber <= 999999999 ) {
            this.decimalNumerals = decimalNumerals;
        } else {
            if ( numberInENotation.test(decimalNumerals) ) {
                //exitStatus = exitStatusENotation;

                throw new Error(`Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: ${decimalNumerals}`);
            } else {
                //exitStatus = exitStatusOutOfRange;

                throw new Error(`Out of range: parameter passed is not a positive decimal integer in the range from 1 to 999999999 inclusive for conversion into English words: ${decimalNumerals}`);
            }
        }
    }

    getCharacteristicAndPowerExponent() {
        const self = this;

        let characteristicPowerExponent = { characteristic: undefined, powerExponent: undefined };
    
        for ( let powerOfTenExponent = 0; powerOfTenExponent < 9; powerOfTenExponent++ ) {
            let x = self.decimalNumber / Math.pow(10, powerOfTenExponent);
    
            let xInt = parseInt(x.toString());
    
            if ( 0 <= xInt && xInt < 10 ) {
                characteristicPowerExponent = { characteristic: xInt, powerExponent: powerOfTenExponent };
    
                break;
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
        //
        // 6) This example exhibits the type of error messages that are output when the corresponding exceptions are thrown:
        //
        //      node ./convertDecimalIntegersToWords.js 99.88 99r123 999E3 1000e3 3.141 1E6 999888777666
        //      Number is not an integer: parameter passed is not a whole number as it has a fractional part: 99.88
        //      Invalid non-numerical character in parameter: parameter passed is not a positive decimal integer because it contains a character that is not a digit: 99r123
        //      Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: 999E3
        //      Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: 1000e3
        //      Number is not an integer: parameter passed is not a whole number as it has a fractional part: 3.141
        //      Number in exponential notation: parameter passed is expressed in exponential notation, that is there is an e or E in its representation: 1E6
        //      Out of range: parameter passed is not a positive decimal integer in the range from 1 to 999999999 inclusive for conversion into English words: 999888777666

        const self = this;
 
        let numberInWords = '';

        let magnitudePower = self.getCharacteristicAndPowerExponent();
        let characteristic = magnitudePower.characteristic;
        let powerTenExponent = magnitudePower.powerExponent;

        if ( typeof characteristic !== 'undefined' && typeof powerTenExponent !== 'undefined' ) {
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
    
                case 1: // This case processes positive decimal integers in the tens (10s).  It is called recursively by case 4, the tens of thousands, and
                        // case 7 for the tens of millions; in each of these cases the recursion is on the first two decimal digits (10s).
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
    
                case 2: // This case processes positive decimal integers in the hundreds (100s).  It is called recursively by case 5, the hundreds of thousands, and
                        // case 8 for the hundreds of millions; in each of these cases the recursion is on the first three decimal digits (100s).
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
    
                case 4: // Similar to case 7: (recursive call for tens).  This case processes positive decimal integers in the tens of thousands (10s of 1000s).
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
    
                        // This test determines whether the word 'and' (hundredsUnitsSeparator) is required in the English words for the residual.
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
    
                case 7: // Similar to case 4: (recursive call for tens).  This case processes positive integers in the tens of millions (10s of 1000000s).
                    firstTwoDigits = self.decimalNumber.toString().substring(0, 2);
    
                    residual = self.decimalNumber - Number(firstTwoDigits) * Math.pow(10, powerTenExponent - 1);  // Subtracting 1 in the power is the same as division by 10.
    
                    firstTwoDigits = new PositiveDecimalIntegerInWords(Number(firstTwoDigits)).toWords();
    
                    if ( residual > 0 ) {
                        // The residual decimal integer is dealt with by a recursive call.
                        let residualInWords = new PositiveDecimalIntegerInWords(residual).toWords();
    
                        // This test determines whether the word 'and' (hundredsUnitsSeparator) is required in the English words for the residual.
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
    
                        // This test determines whether the word 'and' (hundredsUnitsSeparator) is required in the English words for the residual.
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


const convertDecimalIntegersToWords = (possiblePositiveIntegers) => {
    let decimalPositiveIntegers = [];

    if ( Array.isArray(possiblePositiveIntegers) ) {
	possiblePositiveIntegers.forEach( possiblePositiveInteger => {
	    if ( Number.isInteger(Number(possiblePositiveInteger)) && Number(possiblePositiveInteger) > 0 ) {
		decimalPositiveIntegers.push( Number(possiblePositiveInteger) );
	    }
	} );
    } else if ( Number.isInteger(Number(possiblePositiveIntegers)) && Number(possiblePositiveIntegers) > 0 ) { 
	decimalPositiveIntegers = [ Number(possiblePositiveIntegers) ];
    }

    let decimalPositiveIntegersInWords = [];

    decimalPositiveIntegers.forEach(function(decimalInteger) {
        try {
            const decimalIntegerValue = new PositiveDecimalIntegerInWords(decimalInteger);
            const decimalIntegerInWords = decimalIntegerValue.toWords();
       
    	    const decimalIntegerInWordsObj = { decimalInteger: decimalInteger, decimalIntegerInWords: decimalIntegerInWords };
    
    	    decimalPositiveIntegersInWords.push(decimalIntegerInWordsObj);
        }
        catch ( parametricErrorMessage ) {
        }
    });

    return decimalPositiveIntegersInWords;
};


module.exports = convertDecimalIntegersToWords;
