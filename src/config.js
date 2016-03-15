/**
 * @file 配置，和 css 中的样式对应
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {


    // // .branch-middle 的宽度
    // branchMiddleWidth: 260,

    // // 木头左右摇摆时和下面已经落下木头中的最上面那根木头的距离
    // swingBranchTop: 40,

    // // 居中时的 margin-left 值
    // centerMarginLeft: -135,

    // // 左右摇摆的距离
    // swingDistance: 130

    var exports = {
        // 木头 .branch-item 的默认宽度，里面的 .branch-middle 的宽度是 branchWidth - 10
        defaultBranchWidth: 270,
        // defaultBranchWidth: 150,

        // 木头左右摇摆时和下面已经落下木头中的最上面那根木头的距离
        swingBranchTop: 40,

        // 每根左右摇摆的木头下落的距离
        dropDistance: 20,

        // 页面上最多有几根落下的木头，再多的话，层就要往下滑动了
        maxBranchNum: 15,

        // 基础分数
        baseScore: 10

    };

    return exports;

});
