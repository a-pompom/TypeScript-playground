# ゴール

## 用語整理

### Array

配列を表現する型。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

> 記法: `<Type>[]`

### Tuple

配列の中でも特に、要素数と各要素の型を定めたもの。

> 記法: `[<Type>...]`

[参考](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

```TypeScript
// [number, number]がタプルを表現する型アノテーション
const add = (pair: [number, number]): number => {
    return pair[0] + pair[1];
};
```

## Function

関数を表現する型。
関数式・関数宣言の引数や戻り値へ型アノテーションを加える記法と、型として関数そのものを記述する記法がある。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions)

### Parameter

Parameter部分へ型アノテーションを記述することで、引数に型の制約を加えることができる。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#parameter-type-annotations)

```TypeScript
// Sample
const add = (former: number, latter: number) => former + latter;
```

### Return Type

戻り値も引数と同じように型アノテーションの形式で記述できる。

[参考](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#return-type-annotations)

> 記法: `const <FunctionName> = (<parameter1>: <Type>, ...): <ReturnType> => \{ <FunctionBody> \};`

```TypeScript
// Sample
const add = (former: number, latter: number): number => {
    return former + latter;
};
```

## More on Functions

TypeScriptでは関数のためのさまざまな記法を用意しているので、もう少し詳しく見てみる。

### Type Aliasとの組み合わせ

Type Aliasで関数の型を先に宣言しておけば、ParameterやReturn Typeに相当する型注釈を省略することもできる。

```TypeScript
// Sample
type Add = (former: number, latter: number) => number;
const add: Add = (former, latter) => former + latter;
```

#### 補足: なぜ型エイリアスで記述する関数は戻り値を「:」ではなく「=>」で記述するのか

※ 公式ドキュメントなどで明確に言及されていなかったので、ここでは仮説を述べる。

関数式や関数宣言に対する型付けと、関数そのものを表現する型は、どちらも関数への型付けという意味で同じように見える。
しかし、両者は型が表現しているものが異なるのである。
関数式・関数宣言で書かれている型は、既にある関数のParameterやReturn Typeに従属する型アノテーションである。
一方、型エイリアスの例で見た記法は、型で関数全体を表現している。

言い換えれば、前者は関数式・関数宣言でしか書けないが、後者は変数への型注釈・オブジェクトのプロパティなど、型を表現できるところであればどこでも書くことができる。

以上のように、型エイリアスの例で見た関数の戻り値の書き方は関数式・関数宣言への注釈ではなく、型を表現する記法の一部であることから、書き方が異なると考えられる。
また、コールバック関数を引数に記述するとき、「:」による型アノテーションでは読みづらくなることも一因ではないかと思う。

### Generic Function

関数の引数同士・引数と戻り値の型に関連があり、かつ関数を汎用的に扱いたいことがある。
例えば配列の最初の要素を返却するような関数は、引数と戻り値の型に関連があり、かつどのような型の配列を受け取るかは呼び出すまで定まらない。

これだけでは分かりにくいので、実際にforEach関数っぽいものをつくってみる。

```TypeScript
// 型定義
type EachFor = <T>(
    array: T[],
    fn: (value: T, index: number, array: T[]) => void
) => void;

/**
 * forEachっぽくリストを走査
 *
 * @param array 走査対象リスト
 * @param fn 走査処理
 */
const eachFor: EachFor = (array, fn) => {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
};

// 関数呼び出し 要素の型から「T」の型が推論される
// eachFor<number>(...); のようにも書ける
const numbers = [1, 2, 3, 4, 5];
eachFor(numbers, (value, index, array) => {
    console.log(value);
});
```

`<>`で囲ったものは型パラメータと呼ばれる。パラメータという名の通り、具体的な型は実装で初めて定まる。
`eachFor()`の例では、呼び出すときに渡された引数から、`<T>`はnumber型へと確定する。

このように型を推論することは`Type inference`とも呼ばれるようだ。

> 記法-関数: `\<GenericType\>(...) => \{...\}`

> 記法-型エイリアス: `type <TypeAlias>\<GenericType\> = ...`

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions)


#### 補足: なぜ型パラメータは複数の箇所へ記述できるのか

型パラメータは関数の括弧の手前に書くものや、型エイリアス名の後ろに書くものがある。
これらの違いはなんだろうか。
例のごとく公式では言及されていなかったので、仮説を立てるために実際に型エイリアスへ型パラメータを加えた例を見てみる。

```TypeScript
type List<T> = {
    item: T[],
    add: (value: T) => T[],
    get: (index: number) => T,
};
```

これを`add: <T>(value: T) => T[],`のように書いていた場合、型パラメータのスコープは関数で閉じることになる。
つまり、型エイリアスの型パラメータは、関数を対象としたものよりもスコープが広くなることを意味する。
オブジェクト全体で汎用的な型を扱いたいときには型エイリアスへ型パラメータを付与するのがよいだろう。

まとめると、型が必要なスコープへ型パラメータを定義するよう使い分けるとよいと思われる。


### Optional Parameters

関数の引数にて、`arg?: <TypeAnnotation>`のように引数名の末尾へ`?`を加えることで、必須でない引数を実現できる。
より正確には、型アノテーションで指定した型とundefinedを合併したものが引数の型となる。

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)

### Other types

その他関数で重要な型を見ておく。

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#other-types-to-know-about)

#### void

関数が戻り値を持たないことを表現。

#### never

無限ループや例外を送出するなどにより、値を返す処理へ到達しないことを表現。


### Rest Parameters

可変長引数を実現するための記法。

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters)

> 記法: `(arg1: <TypeExpression>, ...args: <TypeExpression>[]) => {}`

```TypeScript
// Sample
const sum = (...numbers: number[]): number => {
  return numbers.reduce((total, current) => total + current);
};

// 1, 6がそれぞれ出力される
console.log(sum(1));
console.log(sum(1, 2, 3));
```

### Rest Arguments

配列を関数の各引数へ展開するための記法。スプレッド演算子により実現される。

[参考](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-arguments)

```TypeScript
// Sample
const add = (former: number, latter: number): number => {
    return former + latter;
};

const numbers = [1, 2] as const;
console.log(add(...numbers));
```

#### 補足: なぜ配列をそのままRest Argumentsとして渡せないのか

配列をそのままスプレッド演算子で展開して引数とすると、TypeScriptではエラーとなる。
これは、配列がミュータブルであり、引数の数と合致する保証がないことによる。

よって、tuple型とする・配列をconst assertionでイミュータブルとする・関数のパラメータをRest Parametersとするか
いずれかの場合のみ、Rest Argumentsを引数として指定できる。
