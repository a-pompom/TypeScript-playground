// in演算子
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

// instanceof

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


