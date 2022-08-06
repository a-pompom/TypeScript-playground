# 概要

Jestへ入門する第一歩として、Hello Worldのテストコードを書いてみます。

※ テストコード自体にも入門しておきたい場合には、[こちら](https://a-pompom.net/article/unit-test/introduction/)の記事を参考にしていただければ幸いです。

## ゴール

Jestで文字列Hello Worldを返却する関数のテストコードを書けるようになることを目指します。

## 目次

[toc]

## 用語整理

* テスティングフレームワーク: ライブラリの形で提供されることが多い、テストコードに一定の構造を持たせ、検証するためのもの
* assertion: 表明・主張の意味を持つ assertionが正しいかをもって、テストコードの成否が決められる
* matcher: assertionの検証手段 例えば`toBe()`は`Object.is()`に相当するmatcherである 


## Jestとは

[公式](https://jestjs.io/)いわく、Jestとは、以下のように説明されています。

> Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

ざっくり訳すと、Jestはシンプルさに焦点をあてた、使っていて楽しいJavaScriptのテスティングフレームワークである、といったところでしょうか。
Jestを導入すれば、シンプルなテストコードでJavaScriptの実装コードの動きを確かめられそうです。早速Hello Worldから試してみましょう。


## はじめてのテストコード

テストコードへ取り掛かる前に、まずはテスト対象となる処理であるHello Worldを実装していきます。
JavaScriptのHello Worldと言えば`console.log('Hello World')`ですが、テストコードを書きやすくするため、文字列`Hello World`を返却する関数で実装することにします。

### Hello World関数

文字列`Hello World`を返却するだけの関数です。コードも問題なく理解できるかと思います。

```typescript
// src/hello.ts
/**
 * 挨拶文をつくる
 *
 * @return Hello World
 */
export const hello = (): string => {
    return 'Hello World';
}
```

このような関数をJestでどのように確かめていくのか、考えていきましょう。

### HelloWorld関数をテストする

Jestで書かれたテストコードには、実装コードでは見かけなかったものがいくつか登場します。見慣れないものを1つ1つ紹介していきながら全体像を組み立てると迷子になるかもしれません。
ですので、実装コードもシンプルであることから、まずはテストコードを見て全体像を掴んでおきます。どのようなことがやりたいのか、コメントなどから雰囲気を見ておきましょう。

```typescript
// tests/hello.tests.ts
// テストしたい実装をimport
import {hello} from 'Jest/helloWorld/src/hello';

// describe()でテストコードをグループ化
describe('Hello World', () => {

    // test()でテストの1つの単位を表現
    test('文字列Hello Worldが得られること', () => {
        // GIVEN
        const sut = hello;
        const expected = 'Hello World';
        // WHEN
        const actual = sut();
        // THEN
        // いわゆるassertion
        expect(actual).toBe(expected);
    });
});
```

これだけでは難しそうに見えるので、Jestが提供してくれているものをざっくりとグループ分けしておきましょう。
グループに名前をつけて分類することで、見慣れない処理が何をやろうとしているのか理解する助けとなるはずです。実際に選り分けてみると、

* テストコードの枠組みをつくる(describe, test)
* assertionによりコードを検証(expect, toBe)

といったようになります。それぞれが自身の役割を果たすためにどのような仕組みを持つのか、見ていきます。

### テストコードの枠組み

ここでは、テストコードの枠をつくっている処理を追ってみます。関数を引数にとる関数でなんだか複雑そうですが、やりたいことが掴めれば全容も見えてくるはずです。

#### describe

describe関数は、関連するテストをまとめたブロックをつくるためのものです。`説明する`といった意味があることから、テストのまとまりに名前をつけてグループ化することを表現しています。

[参考](https://jestjs.io/docs/api#describename-fn)

> 書式: `describe(name, fn)`

name引数にはグループの説明を・fn引数にはテストをまとめた関数を記述します。
describe関数を省略してトップレベルにテストを書くこともできますが、テストが増えてきたときに見通しが良くなるので、describeで束ねておく習慣を身につけておくのがよいでしょう。

#### test/it

test関数/it関数は、テストしたいことを表現するためのものです。it関数はtest関数のエイリアスで、同じ形式で記述することができます。

[参考](https://jestjs.io/docs/api#testname-fn-timeout)

> 書式: `test(name, fn, timeout)`

name引数にはテストしたいことの概要を・fn引数にはテストそのもの(assertion)を記述します。
また、timeout引数はオプショナルで、指定したミリ秒以上(デフォルトは5秒)経過するとテストが失敗するようになります。これはテスト対象の性能を見たいときに指定するとよいでしょう。

#### 補足: なぜtest/it関数の2つが存在するのか

it関数はtest関数のエイリアスである、と先ほどは説明しました。ですが、短くなったのも2文字程度です。なんのために別で関数が用意されているのでしょうか。
これは、it関数ではname引数と繋げることで自然な英文として見やすくなるようにすることを意図していたものだと思われます。

[参考](https://stackoverflow.com/questions/45778192/what-is-the-difference-between-it-and-test-in-jest)

例えば、it関数のname引数が`returns Hello World`だった場合、`it('returns Hello World', ...)`というふうに書かれます。気持ち見やすくなった気がしないでもありません。
このような違いを踏まえた上で、test/it関数を使い分けていくとよいのではないかと思います。


### assertion

テストコードの枠組みがざっくりと見えてきたので、テスト本体へ目を向けてみましょう。復習がてらもう一度テスト本体を抜粋して見てみます。

```TypeScript
// test()でテストの1つの単位を表現
test('文字列Hello Worldが得られること', () => {
    // GIVEN
    const sut = hello;
    const expected = 'Hello World';
    // WHEN
    const actual = sut();
    // THEN
    // いわゆるassertion
    expect(actual).toBe(expected);
});
```

GIVEN・WHENに相当するところでは、hello関数を呼び出した結果・期待値をそれぞれactual・expectedとして保持しています。
Jest特有の表現が出てくるTHENの部分では、actual・expectedをどのようにassertionとして検証しているのか、探ってみましょう。

#### expect

期待を意味するexpect関数では、assertionのためのmatcherと呼ばれるオブジェクトを生成します。matcherは後ほど詳しく見ていきますが、ここではassertionのための関数ぐらいに捉えておきましょう。

[参考](https://jestjs.io/docs/expect#expectvalue)

> 書式: `expect(value)`

これだけでは言葉のイメージとコードが結びつかないので、expect関数を呼び出してmatcherを得る処理・assertionを分けて考えてみます。

```TypeScript
// expect関数で実際の値(actual)を対象としたmatcherオブジェクトを作成
const matcher = expect(actual);
// matcherオブジェクトのtoBeメソッドを実行することでassertionを検証
matcher.toBe(expected);

// expect関数からmatcherが得られるので、繋げて書くことができる
expect(actual).toBe(expected);
```

このように、expect関数がmatcherを返してくれることで、`expect(実際の結果).toBe(期待値)`のように、assertionをより直感的に書けるようになります。

#### matcher

toBe関数に触れる前に、matcherという用語についてもう少し見ておきます。
まずは単語の意味から確認しておきます。2つのものが等しいか判定するもの、ということを意味しており、マッチングのようなカタカナ言葉でも使われるかと思います。
Hello World関数のテストコードの文脈では、期待値・関数の出力が等しいか判定するためのものがmatcherである、と表現することができます。

Jestにおけるmatcherでは、`関数が呼ばれたという事象`と処理が終わった後の状態が等しいか、といったようなもっと高度なものもあります。
ですが、ひとまず入門段階ではmatcherは期待値と実際の結果を比較することでテストコードの妥当性を評価するものだな、という認識で十分だと思います。

#### toBe

matcherの1つであるtoBe関数を見てみます。

[参考](https://jestjs.io/docs/expect#tobevalue)

> 書式: `.toBe(value)`

これは、内部的に`Object.is()`を呼び出すことで厳密に期待値と実際の結果を比べています。比べた結果が等しい/等しくないかによってテストコードの成否を判定しています。

[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

## まとめ

Hello Worldという単純な処理を通してJestへ入門してみました。
いきなりJest特有の書き方が色々と出てきましたが、テストコードを書く経験を積みながら少しずつ手に馴染ませていきましょう。
