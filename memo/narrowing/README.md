# ゴール

文脈にもとづいて型を絞り込む方法にどのようなものがあるのか、概要を理解することを目指す。

## 用語整理

* 型ガード: 型のコンテキストをTypeScriptに推論させるための処理
* narrowing: 定義された型をより具体的なものへと狭めること

## narrowing

JavaScriptのコードでも、typeof演算子やif文などで型に応じて処理を分岐させることがあった。
TypeScriptはこのような処理から型のコンテキストを推論し、型によって挙動が異なるような処理も型安全に書くことができる。

公式に書かれていた例を見てみる。

```TypeScript
// 文字列の左側にパディングを追加
// パディングが数値であればスペースを文字数分追加
// パディングが文字列であれば文字列をパディングとして追加
function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        // (parameter) padding: number
        return " ".repeat(padding) + input;

    }
    // (parameter) padding: string
    return padding + input;
}
```

ここでは、typeof演算子を利用した型による分岐から、`number | string`型をより具体的な型へ絞り込んでいる。
つまり、padding引数を、型numberのコンテキストでは数値として・型stringのコンテキストでは文字列として扱うことができる。

以降では、型のコンテキストがどのように定まるのか、例を見ていく。

### typeof operator

まずは`typeof`演算子の復習をしておく。
[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

```TypeScript
// 記法
typeof operand
typeof(operand)
```

オブジェクトまたはプリミティブをオペランドに指定すると、対象の型名を表現する文字列へと評価される。
最初の例で見た通り、TypeScriptでは評価結果に応じて型をより具体的なものへ推論することができる。このように、型を推論する判断材料として利用できるような処理は型ガードと呼ばれる。

### in operator narrowing

最初に`in`演算子を復習。

[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)

> 記法: `prop in object`

in演算子は、propがobjectのプロパティに存在するか判定。
propは文字列またはSymbolで、objectはあらゆるオブジェクトを許容。

TypeScriptでは、in演算子の評価結果から、オブジェクトの型を絞り込むことができる。

[参考](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing)

```TypeScript
// Sample
type AnchorTag = {
    href: string;
    text: string;
};
type ParagraphTag = {
    text: string
};

type SampleHTMLElement = AnchorTag | ParagraphTag

/**
 * HTML要素をコンソールへ出力
 *
 * @param element 出力対象要素
 */
const printHTMLElement = (element: SampleHTMLElement): void => {

    // このコンテキストはAnchorTag型のみ存在できる
    if ('href' in element) {
        console.log(`href: ${element.href}, text: ${element.text}`);
        return;
    }
    // このコンテキストはParagraphTag型のみ存在できる
    console.log(`text: ${element.text}`);
}
// href: https://a-pompom.net, text: ブログ
printHTMLElement({href: 'https://a-pompom.net', text: 'ブログ'});
// text: ブログ
printHTMLElement({text: 'ブログ'});
```

### instanceof narrowing

例のごとくinstanceof演算子の復習から始める。

[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

> 記法: `object instanceof constructor`

クラスはコンストラクタオブジェクトのシンタックスシュガーなので、インスタンス・クラス名を記述することで判定できる。

```TypeScript
// インスタンスの型に応じてログへ出力する情報を分けたい
/**
 * 一般ユーザを表現することを責務に持つ
 */
class User {
    public id: number;

    constructor(id: number) {
        this.id = id;
    }
}

/**
 * 管理者ユーザを表現することを責務に持つ
 */
class AdminUser {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

/**
 * ユーザ情報を出力
 * @param user 対象ユーザ
 */
const logUserInfo = (user: User | AdminUser): void => {

    // このコンテキストはUser型のみ存在し得る
    if (user instanceof User) {
        console.log(`User: id=${user.id}`);
        return;
    }
    // このコンテキストはAdminUser型のみ存在し得る
    console.log(`Admin: id=${user.id}, name=${user.name}`);
};

// User: id=9999
// Admin: id=1000, name=Admin
logUserInfo(new User(9999));
logUserInfo(new AdminUser(1000, 'Admin'));
```

### type predicates

ユーザ定義の型ガードは、型述語と呼ばれる記法で記述することができる。
typeof, instanceof演算子など、JavaScriptに用意された型ガードによらない型ガードを定義したいときに有用。

```TypeScript
// 記法
function customTypeGuard (arg: SomeType): arg is SpecificType { 
    if (someCondtion) {
        return true;
    }
    return false;
};

if (customTypeGuard('someValue')) {
    // このコンテキストは型ガードにより絞り込まれた型のみ存在し得る
}
```

関数はbool値を返却し、trueで評価されたとき、以降のコンテキストにおいて型を絞り込むことができる。
言い換えれば、type predicatesは、関数の形式でtypeof, instanceof演算子のような型を分岐させる演算を可能とする。


### Discriminated Unions

オブジェクトの一部のプロパティの値から型を絞り込めるUnion型をDiscriminated Unionsと呼ぶ。

```TypeScript
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        // このコンテキストでは、Circle型のみ存在し得る
        case "circle":
            return Math.PI * shape.radius ** 2;

        // このコンテキストでは、Square型のみ存在し得る
        case "square":
            return shape.sideLength ** 2;
    }
}
```

例にある通り、`Circle | Square`のUnion型は、kindプロパティの値によって到達し得るコンテキストを絞り込むことができる。