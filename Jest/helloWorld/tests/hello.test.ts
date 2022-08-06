import {hello} from 'Jest/helloWorld/src/hello';

describe('Hello World', () => {

    test('文字列Hello Worldが得られること', () => {
        // GIVEN
        const sut = hello;
        const expected = 'Hello World';
        // WHEN
        const actual = sut();
        // THEN
        expect(actual).toBe(expected);
    });
});
