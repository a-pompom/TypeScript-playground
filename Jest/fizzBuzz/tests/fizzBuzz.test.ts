import {fizzBuzz} from 'Jest/fizzBuzz/src/fizzBuzz';

// 単一の入力をもとに検証
describe('Fizz Buzz Single', () => {

    // 3で割り切れる数はFizzが得られるか
    test('Fizz', () => {
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
        expected: string | number
    };

    // 3で割り切れる数はFizzが得られるか
    test.each<Args>([
        {value: 3, expected: 'Fizz'},
        {value: 99, expected: 'Fizz'},
        {value: 333, expected: 'Fizz'},
    ])('Fizz', (args) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(args.value);
        // THEN
        expect(actual).toBe(args.expected);
    });

    // 5で割り切れる数はBuzzが得られるか
    test.each<Args>([
        {value: 5, expected: 'Buzz'},
        {value: 55, expected: 'Buzz'},
        {value: 500, expected: 'Buzz'},
    ])('Buzz', (args) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(args.value);
        // THEN
        expect(actual).toBe(args.expected);
    });

    // 15で割り切れる数はFizzBuzzが得られるか
    test.each<Args>([
        {value: 15, expected: 'FizzBuzz!!'},
        {value: 150, expected: 'FizzBuzz!!'},
    ])('FizzBuzz', (args) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(args.value);
        // THEN
        expect(actual).toBe(args.expected);
    });

    // 3,5,15で割り切れない数はその数自身が得られるか
    test.each<Args>([
        {value: 1, expected: 1},
        {value: 15.5, expected: 15.5},
        {value: 889, expected: 889},

    ])('number', (args) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(args.value);
        // THEN
        expect(actual).toBe(args.expected);
    });
});
