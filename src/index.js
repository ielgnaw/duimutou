/**
 * @file Description
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var create = require('./create');

    var doc = document;

    var guideNode = doc.querySelector('.guide-tip');
    var startNode = doc.querySelector('.start');
    var gameNode = doc.querySelector('.game-content');

    /**
     * 落下的木头中最上方的那个木头的垂直偏移距离，作为下一个木头落下的基准
     *
     * @type {number}
     */
    var offsetTop = 0;

    /**
     * 木头落下后，前一根和后一根木头垂直偏移距离的差值
     *
     * @type {number}
     */
    var BASE_DROPED_DISTANCE = 12;

    /**
     * 木头左右摇摆时和下面已经落下的最上面那根木头的距离
     *
     * @type {number}
     */
    var BASE_SWING_DISTANCE = 40;

    /**
     * 游戏开始回调函数
     *
     * @param {Object} e 事件对象
     */
    function startGame(e) {
        e.stopPropagation();
        e.preventDefault();
        guideNode.style.display = 'none';
        gameNode.style.display = 'block';
    }
    // 26
    /**
     * 点击屏幕放下木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();

        var topNode = document.querySelector('.last');
        var translateX = 0;

        var transform = window.getComputedStyle(topNode).transform || window.getComputedStyle(topNode).webkitTransform;

        var match = transform.match(/matrix\(1, 0, 0, 1, (.*),[\s\S]*/);
        if (match) {
            translateX = match[1];
        }
        topNode.classList.add('paused');
        topNode.classList.remove('swing');

        // console.warn(topNode.style.transform);
        // console.warn(topNode.style.webkitTransform);
        // console.warn(window.getComputedStyle(topNode).transform);
        topNode.style.transform = 'translate3d(' + translateX + 'px, 26px, 0)';
        topNode.style.webkitTransform = 'translate3d(' + translateX + 'px, 26px, 0)';
        // topNode.classList.remove('paused');
        topNode.classList.add('dropdown');
    }

    var exports = {};

    exports.init = function () {
        startNode.addEventListener(globalData.touchStartEvent, startGame);
        offsetTop = document.querySelector('.first').offsetTop;

        document.body.addEventListener(globalData.touchStartEvent, dropBranch);
        console.warn(globalData);
        create(offsetTop - BASE_SWING_DISTANCE);
    };

    return exports;

});
