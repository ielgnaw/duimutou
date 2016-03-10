/**
 * @file 配置，和 css 中的样式对应
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {


    // // .branch-middle 的宽度
    // branchMiddleWidth: 260,

    // // 木头左右摇摆时和下面已经落下木头中的最上面那根木头的距离
    // swingBranchTop: 40,

    // // 每根左右摇摆的木头下落的距离
    // dropDistance: 23,

    // // 居中时的 margin-left 值
    // centerMarginLeft: -135,

    // // 左右摇摆的距离
    // swingDistance: 130

    var exports = {
        // 木头 .branch-item 的默认宽度，里面的 .branch-middle 的宽度是 branchWidth - 10
        // branchWidth: 270,
        branchWidth: 150,

        // 木头左右摇摆时和下面已经落下木头中的最上面那根木头的距离
        swingBranchTop: 40
    };

    return exports;

});
