# ゴール

基本的な型の概要・宣言方法を理解することを目指す。

## 用語整理

* 型: 値・値を利用してできることの集合

### any

あらゆる型の性質を持つ型。
どんな演算・関数呼び出しも許容されるが、制約がないことから静的な検証ができない。
よって、よほどのことがない限りは使わない方がよい。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

### unknown

不定である型。
anyとは異なり、型を確定させるまであらゆる処理が許容されない。
これはつまり、不確定な型を型安全性を保ったまま記述することができる。

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)

### string, number, boolean

文字列・数値・bool値を表現するプリミティブ型。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)

### bigint, symbol

JavaScriptのプリミティブ型のうち、利用頻度はあまり多くないもの。
bigintはnumber型の表現できる範囲を超える大きな数値を扱うためのものもの。
symbolはオブジェクトの名前空間を汚さずに新たなプロパティを定義するためのもの。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#less-common-primitives)


### object

オブジェクトを表現した型。
色々と型を注釈する方法はあるようだが、オブジェクトリテラル表記で書くのがよいと思われる。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types)

> 記法: `const <objectName>: { {<propertyName>: <value>;}+ }`

また、オブジェクトリテラル表記では、プロパティを`;`で区切る。
これは、他の言語においてインタフェースがプロパティをセミコロンで区切っていることに由来していると思われる。

[参考](https://stackoverflow.com/questions/27994253/why-is-the-separator-in-a-typescript-typememberlist-semicolon-as-opposed-to-comm)

```TypeScript
// Sample
const user: { name: string; age: int; } = {
    name: 'pom',
    age: 0,
};
```

### Union Types

値が2つ以上の型の和集合のいずれかの要素に属する場合、値はUnion型と呼ばれる。
例えば、文字列または数値型である要素は、`string | number`と表現される。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

Union型は一定の制約を与えながら型の範囲を拡張したいときに有用。

### Type Alias

型に別名を与える機能をType Aliasと呼ぶ。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

> 記法: `type <TypeName> = <TypeAnnotation>;`

```TypeScript
// Sample
type User = {
    name: string;
    age: number;
};

const user: User = {
    name: 'pom',
    age: 999,
};
```