const convertDecimalIntegersToWords = require('../src/convertDecimalIntegersToWords');

// As these two tests are specific to the same function, group them together as a test suite with a description of their purpose.
describe( 'Decimal Positive Integers', () => {
    test('Test 1 - convertDecimalIntegersToWords by passing it a single positive integer and matching the word representaion that it returns.', () => {
	// const retValue = convertDecimalIntegersToWords(999900001);
    	// expect(retValue[0].decimalIntegerInWords).toBe("nine hundred and ninety nine million, nine hundred thousand and one");

    	expect(convertDecimalIntegersToWords(999900001)[0].decimalIntegerInWords).toBe("nine hundred and ninety nine million, nine hundred thousand and one");
    });
    
    test('Test 2 - convertDecimalIntegersToWords by passing it a single positive integer and checking that the correct argument was passed.', () => {
    	const convertDecimalIntegersToWords = jest.fn();
    
    	convertDecimalIntegersToWords(999900001);
    
    	expect(convertDecimalIntegersToWords).toHaveBeenCalledWith(999900001);
    });
});
