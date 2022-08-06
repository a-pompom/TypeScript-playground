export type FizzBuzzMessage = 'Fizz' | 'Buzz' | 'FizzBuzz!!' | number;

// 割る数
const DIVISOR_FIZZ = 3;
const DIVISOR_BUZZ = 5;
const DIVISOR_FIZZBUZZ = 15;

/**
 * 数値に応じたFizzBuzzメッセージを生成
 *
 * @param value 入力値
 */
export const fizzBuzz = (value: number): FizzBuzzMessage => {

    if (value % DIVISOR_FIZZBUZZ === 0) {
        return 'FizzBuzz!!';
    }
    if (value % DIVISOR_FIZZ === 0) {
        return 'Fizz';
    }
    if (value % DIVISOR_BUZZ === 0) {
        return 'Buzz';
    }

    return value;
};