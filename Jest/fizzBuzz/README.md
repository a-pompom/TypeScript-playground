# 概要

Jestの肩慣らしとして、Fizz Buzzのテストコードを書いてみます。

## ゴール

複数のテストケースを効率良く検証するために、パラメータ化テストの書き方を理解することを目指します。

## 目次

[toc]


## つくりたいもの

[Fizz Buzz](https://en.wikipedia.org/wiki/Fizz_buzz)と呼ばれる簡単なゲームをつくってみます。ルールは至ってシンプルで、以下の4つで述べられます。

* 1から順に数値をカウントアップ
* 参照している数値が3で割り切れるときは`fizz`と言う
* 参照している数値が5で割り切れるときは`buzz`と言う
* 参照している数値が15で割り切れるときは`fizz buzz`と言う

プログラムっぽく表現すると、数値が3・5・15で割り切れるときは特定のメッセージを、それ以外は数値自身を出力する、といった感じでしょうか。

Hello Worldの例では単一の出力をテストコードで表現できれば十分でした。
ですが、Fizz Buzzゲームでは出力が条件に応じてさまざまなものに変化します。入力の数値が3で割り切れるとき・5で割り切れるとき...それぞれを考慮しなければなりません。
条件によって出力が変わる処理をどのように検証するのか、考えていきましょう。

## Fizz Buzz関数

ここでは話を簡単にするために、Fizz Buzzゲームを「数値が入力として与えられると対応するメッセージを出力する関数」として扱います。
こうすることで、今回の目的である、出力が入力によって変わるような処理をどう検証するかに集中することができます。

なんだか難しそうに見えますが、処理自体はシンプルなものなので、実装コードを見ればやりたいことも見えてくるはずです。

```TypeScript
// src/fizzBuzz.ts

// 得られる出力を型宣言で定義
type FizzBuzzMessage = 'Fizz' | 'Buzz' | 'FizzBuzz!!' | number;

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

    // 15で割り切れる
    if (value % DIVISOR_FIZZBUZZ === 0) {
        return 'FizzBuzz!!';
    }
    // 3で割り切れる
    if (value % DIVISOR_FIZZ === 0) {
        return 'Fizz';
    }
    // 5で割り切れる
    if (value % DIVISOR_BUZZ === 0) {
        return 'Buzz';
    }

    // メッセージの条件に合致しない場合は入力の数値をそのまま出力
    return value;
};
```

if文が加わったことで、関数から出力されるものが4パターンに増えました。
どんなテストコードを書けばこのような関数が期待通りに動いていることを保証できるのか、探っていきます。


## テストコード

Fizz Buzz関数のテストコードを書いてみます。Hello Worldと比べてみると、条件が色々と増えてなにやら難しそうです。
ですが、条件1つ1つに対してテストコードを書くと意識すれば、シンプルに考えられます。

具体例として、3で割り切れる数が入力して与えられた場合、メッセージ`Fizz`が出力として得られるか確かめるテストコードを見てみましょう。

```TypeScript
// tests/fizzBuzz.test.ts

import {fizzBuzz} from 'Jest/fizzBuzz/src/fizzBuzz';

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
```

Hello World関数をテストしたときと同じような流れであることが分かります。
最初にテスト対象と入力、そして期待値を定義します。そしてテスト対象を呼び出して得られた出力と期待値を比較し、一致したことをもってテストの成功とみなしています。

どうやらFizz Buzz関数も1つの条件に着目すれば、Hello Worldとあまり変わらずテストコードを書いていけそうです。

### パラメータ化テスト

しかし、1つ問題があります。
今回のテストコードは、3で割り切れる数値が入力であった場合を想定しています。そうなると、入力値`3`が動いてくれただけでは、6や9・33といった別の数値でも同じように動作するのか分かりません。

そこで、先ほど書いたテストコードを1つの数値`3`だけでなく3で割り切れるいくつかの数値で試せるようになれば、テストコードの信頼性も高まりそうです。

---

やりたいことを実現するために、パラメータ化テストと呼ばれる手法を導入します。
文字通り、テストコードにパラメータ(引数)を導入することで、さまざまなパターンのテストコードがまとめて書けるようになります。

慣れるまでは記法が複雑でとっつきづらいですが、ここで理解しておけばテストコードを書くのがぐっと楽になるので、ゆっくり立ち向かっていきましょう。

### test.each()

Jestでパラメータ化テストを記述するときは、`test.each()`を利用します。やりたいことは明確なので、どのような記法なのか理解することを目指して見てみます。

[参考](https://jestjs.io/docs/api#testeachtablename-fn-timeout)

> 記法: `test.each(table)(name, fn, timeout)`

なんだか難しそうな書き方に見えます。これは2つの要素に分けて考えると理解しやすくなります。
`test.each(table)`を呼ぶことで、テストを実行する関数が返却されます。得られた関数はHello Worldのテストコードでも書いてきた`test(name, fn, timeout)`と同じ引数をとります。

つまり、上の記法は以下のように解釈することができます。

```TypeScript
// test.each()でパラメータ化されたテストコードを実行するための関数を得る
const parameterizedTest = test.each('<table>');

// test(name, fn, timeout)を拡張した形でパラメータ化テストを書くことができる
parameterizedTest('3で割り切れる', (パラメータ) => {
    // パラメータを参照するテストコード
});
```

※ 厳密には`test.each()`から得られたコールバック関数内部で`test(name, fn, timeout)`そのものが呼び出されています。

#### table

`test.each()`の理解を深めるために、個々の要素をもう少し掘り下げておきます。
ということで、最も重要な引数tableの中身を知ることから始めます。
[参考](https://jestjs.io/docs/api#1-testeachtablename-fn-timeout)

引数tableには配列の配列を指定します。テスト関数へ渡したい複数の引数を配列で表現し、それらをさらに配列でグルーピングするようなイメージです。文章だけでは捉えづらいので、コードも見ておきます。

```TypeScript
// 引数を配列で表現したもの
const args1 = [3, 'Fizz'];
const args2 = [33, 'Fizz'];

// 引数に配列をグルーピングしたものがtable引数
const table = [args1, args2];
```

ここで、引数が1つであった場合、一次元の配列で簡略化することもできます。上の例で渡した引数をオブジェクト化して1つにまとめてみます。

```TypeScript
type Args = {
    value: number,
    expected: 'Fizz' | 'Buzz' | 'FizzBuzz!!' | number,
};
const args1: Args = {value: 3, expected: 'Fizz'};
const args2: Args = {value: 33, expected: 'Fizz'};

// 引数が1つの場合、単なる配列のように記述することができる
const table = [args1, args2];
```

オブジェクトで1つにまとめておくと、プロパティ名で引数に意味を持たせられるようになり、少し読みやすくなりました。
以降にてパラメータ化テストを書くときは、パラメータを1つのオブジェクトにまとめて渡すことにします。

---

さて、引数tableのイメージが固まってきたはずなので、実際に`test.each()`で指定する例を見てみましょう。

```TypeScript
// テスト関数に渡したい引数
type Args = {
        value: number,
        expected: FizzBuzzMessage
};

// パラメータ化テストを生成
const parameterizedTest =  test.each<Args>([
    {value: 3, expected: 'Fizz'},
    {value: 99, expected: 'Fizz'},
    {value: 333, expected: 'Fizz'},
]);
```

`test.each()`にジェネリクスを指定することで、それぞれのパラメータで型の恩恵を受けられるようになります。
[参考](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/jest/index.d.ts)

更に理解を深めるために、コードをどのような意図で書いたのか読み解いていきましょう。

* 型宣言で事前にパラメータとして渡すオブジェクトを定義 こうすることで複数のテストケースで共通の型が使えるようになる
* `test.each()`にジェネリクスで型を指定 すると、引数tableの各パラメータの型が定まり、型の恩恵を授かることができる
* 各パラメータはオブジェクト形式で記述 配列が一次元になったこと・オブジェクトのプロパティ名で何をパラメータとするか明確になったことで読みやすくなったはず


#### テストブロック

`test.each()`の動きが見えてきたので、実際にパラメータ化テストを書いてみます。3で割り切れる数を複数パターン検証することを`test.each()`で表現します。
多くの記法で表現されてはいますが、1つ1つを読み解いていけばきっと理解できるはずです。

```typescript
import {fizzBuzz, FizzBuzzMessage} from 'Jest/fizzBuzz/src/fizzBuzz';


describe('Fizz Buzz', () => {

    // テストへ渡すパラメータの型定義
    type Args = {
        value: number,
        expected: FizzBuzzMessage
    };

    // test.each()で返却された関数を続けて呼び出す
    test.each<Args>([
        {value: 3, expected: 'Fizz'},
        {value: 99, expected: 'Fizz'},
        {value: 333, expected: 'Fizz'},
    ])('3で割り切れる数はメッセージFizzが得られること', ({value, expected}) => {
        // GIVEN
        const sut = fizzBuzz;
        // WHEN
        const actual = sut(value);
        // THEN
        expect(actual).toBe(expected);
    });
});
```

これまでテストコードを書いてきた`test(name, fn, timeout)`を`test.each()`を介して呼び出しています。
また、引数`fn`が受け取る引数はオブジェクトなので、テストコード上で書きやすくなるよう展開しています。

![image](https://user-images.githubusercontent.com/43694794/183236822-b0e351e1-97a0-4daf-b5c2-650808bcce40.png)

実際にテストコードを動かしてみると、渡したパラメータの分だけ検証してくれたようです。

#### name引数

パラメータ化テストを書いていると、一部のパターンだけ動作しないことが時々あります。そんなときのために、テストの結果で個々のパターンを見分けられるようにしたいです。
これは、`test.each()`から得られる関数のname引数を工夫することで実現できます。

[公式](https://jestjs.io/docs/api#1-testeachtablename-fn-timeout)いわく色々な書き方があるようですが、入門段階では`%p`(pretty-format)を指定しておくのがよいと思います。

```typescript
test.each<Args>([
    // パラメータ
])('3で割り切れる数はメッセージFizzが得られること %p', ({value, expected}) => {
    // テストコード
});
```

上のように書いておくと、個々のパラメータを識別できるようになります。

![image](https://user-images.githubusercontent.com/43694794/183237120-d0d9b60e-dd90-48e2-864f-7b154fe6fe02.png)

これでパラメータ化テストの一部が失敗したときも、どのパターンが問題だったのか探しやすくなりそうです。

#### テストコード(全体)

これでFizz Buzzゲームのテストコードを書くのに必要な知識はそろったので、それぞれのパターンを検証していきます。
とはいえやることは大体同じなので、テストコードだけ載せておくに留めておきます。

```typescript
// tests/fizzBuzz.test.ts
import {fizzBuzz, FizzBuzzMessage} from 'Jest/fizzBuzz/src/fizzBuzz';


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
```

#### 補足: タグ付きテンプレートリテラル形式について

`test.each()`の引数tableは、配列の配列だけでなく、タグ付きテンプレートリテラルでも書くことができます。
参考までに公式の例を引用しておきます。

```typescript
test.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
  ${2} | ${1} | ${3}
`('returns $expected when $a is added $b', ({a, b, expected}) => {
    expect(a + b).toBe(expected);
});
```

パラメータが見やすくはありますが、ジェネリクスでパラメータに型を指定できないことから、今回は配列の配列形式を採用しました。
どちらか一方であるべきというものでもないので、好みに応じて書きやすいものを使ってみてください。

#### 補足: なぜすべての条件を1つのパラメータ化テストで書かないのか

パラメータ化テストでテストコードをまとめられるようになると、複数の条件も1つのテスト関数で表現したくなるかもしれません。コードで例を見ておきます。

```typescript
type Args = {
    value: number,
    expected: FizzBuzzMessage
};

test.each<Args>([
    {value: 1, expected: 1},
    {value: 3, expected: 'Fizz'},
    {value: 5, expected: 'Buzz'},
    {value: 15, expected: 'FizzBuzz!!'},
])('Fizz Buzzのルールにもとづくメッセージが得られること %p', ({value, expected}) => {
    // テストコード
});
```

なぜこのように1つにまとめなかったのでしょうか。

---

これは、1つのテストでは1つのことだけを検証することで、テストコードをシンプルに保つためです。
確かめたいことが異なるテストを1つにまとめてしまうと、テストコードで何を検証したいのか曖昧になり、意図が読みづらくなってしまいます。
さらに、複数の観点が混ざることでテストコードや実装に問題があったとき、調べる範囲が不必要に広がってしまうのもよくありません。

テストコードも実装のように単一の責務を心がけて書くようにすると、テストコードが読み/書きやすくなるはずです。


## まとめ

Jestでパラメータ化テストを書くときの書き方・考え方を見てきました。
関数や配列が入れ子になって中々に複雑なものでしたが、身につければ効率よくテストコードを書けるようになるはずです。
