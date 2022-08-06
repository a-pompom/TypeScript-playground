import {fizzBuzz, FizzBuzzMessage} from 'Jest/fizzBuzz/src/fizzBuzz';

// 単一の入力をもとに検証
describe('Fizz Buzz Single', () => {

    test('3で割り切れる数はメッセージFizzが得られること', () => {
        // GIVEN
        const sut = fizzBuzz;
        const value = 3;
        const expected = 'Fizz';
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });
});


describe('Fizz Buzz', () => {

    type Args = {
        value: number,
        expected: FizzBuzzMessage
    };

    test.each<Args>([
        {value: 3, expected: 'Fizz'},
        {value: 99, expected: 'Fizz'},
        {value: 333, expected: 'Fizz'},
    ])('3で割り切れる数はメッセージFizzが得られること %p', ({value, expected}) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });

    test.each<Args>([
        {value: 5, expected: 'Buzz'},
        {value: 55, expected: 'Buzz'},
        {value: 500, expected: 'Buzz'},
    ])('5で割り切れる数はメッセージBuzzが得られること %p', ({value, expected}) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });

    test.each<Args>([
        {value: 15, expected: 'FizzBuzz!!'},
        {value: 150, expected: 'FizzBuzz!!'},
    ])('15で割り切れる数はメッセージFizzBuzz!!が得られること %p', ({value, expected}) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });

    test.each<Args>([
        {value: 1, expected: 1},
        {value: 15.5, expected: 15.5},
        {value: 889, expected: 889},
    ])('3,5,15で割り切れない数はその数自身が得られること %p', ({value, expected}) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });
});
