// forEach関数っぽいものをつくってみる

// 型定義
// 型名にジェネリクスをつけるとスコープが広くなるので、関数側に記述
type EachFor = <T>(
    array: T[],
    fn: (value: T, index: number, array: T[]) => void
) => void;

// 関数定義
// 要素の型は呼び出すときに初めて定まるので、ここでは不定型として扱ってよい
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

// List・ArrayListっぽいものをつくってみる
// 型パラメータのスコープを型定義全体に広げた
// すると、関数だけでなく、各プロパティで型パラメータを参照することができる
type List<T> = {
    item: T[],
    add: (value: T) => T[],
    get: (index: number) => T,
};

// 関数を介してList型を拡張したオブジェクトを返却
// 通常は`class ArrayList<T> implements List<T> {...}`のように書いた方がシンプル
// 今回は実験用に定義
/**
 * ArrayListっぽいオブジェクトを生成
 *
 * @param item 初期値
 */
const makeArrayList = <T>(item: T[]): List<T> => {
    return {
        item,

        add(value) {
            this.item.push(value);
            return this.item;
        },

        get(index) {
            return this.item[index];
        },
    };
};

const arrayList = makeArrayList<string>(['Hello ArrayList']);
console.log('ArrayList Start');
console.log(arrayList.add('Bye ArrayList'));
console.log(arrayList.get(0));
console.log('ArrayList End');


// 線形探索っぽいものをつくってみる
/**
 * 線形探索でリストを探索
 *
 * @param list 探索範囲
 * @param target 探索対象
 *
 * @return 探索対象の探索範囲上の位置 見つからなければ-1を返却
 */
const searchLinear = <T>(list: T[], target: T): number => {

    // 見つからなかった場合は-1を返却
    let targetIndex = -1;

    list.forEach((value, index) => {
        if (value === target) {
            targetIndex = index;
        }
    });
    return targetIndex;
};

console.log('LinearSearch Start');
console.log(`list: [1, 2, 3], target: 1, result: ${searchLinear<number>([1, 2, 3], 1)}`);
console.log(`list: [alice, bob, charlie], target: bob, result: ${searchLinear<string>(['alice', 'bob', 'charlie'], 'bob')}`);
console.log('LinearSearch End');
