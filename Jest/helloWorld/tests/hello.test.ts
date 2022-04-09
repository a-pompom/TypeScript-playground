import { hello } from 'Jest/helloWorld/src/hello';

describe('Hello World', () => {

    test('return Hello World', () => {
        // GIVEN
        const sut = hello;
        const expected = 'Hello World';
        // WHEN
        const actual = sut();
        // THEN
        expect(actual).toBe(expected);
    });
});
