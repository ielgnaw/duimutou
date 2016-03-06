/**
 * @file Description
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global globalData*/

define(function (require) {

    var create = require('./create');

    var doc = document;
    var abs = Math.abs;

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
     * .branch-left 的宽度
     *
     * @type {number}
     */
    var branchLeftWidth = 10;

    /**
     * .branch-middle 的宽度
     *
     * @type {number}
     */
    var branchMiddleWidth = 260;

    /**
     * .branch-right 的 margin-left
     *
     * @type {number}
     */
    var branchMarginLeft = 260;

    /**
     * 每根左右摇摆的木头下落的距离
     *
     * @type {number}
     */
    var BASE_DROPED_DISTANCE = 23;

    /**
     * 木头左右摇摆时和下面已经落下的最上面那根木头的距离
     *
     * @type {number}
     */
    var BASE_SWING_DISTANCE = 40;

    /**
     * .branch-item 的默认 margin-left
     *
     * @type {number}
     */
    var MARGIN_LEFT = 135;

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

    /**
     * 落下时破碎的的小木头动画结束的回调函数
     *
     * @param {Object} e 事件对象
     */
    function breakBranchAniEnd(e) {
        var target = e.target || e.srcElement;
        target.parentNode.removeChild(target);
    }

    /**
     * 木头落下时，破碎的小木头的动画
     *
     * @param {HTML Element} 当前坐落的这个大木头
     * @param {number} marginLeft 小木头的左偏移
     * @param {number} width 小木头的宽度
     * @param {string} direction 方向，是出现左边的小木头还是右边的
     */
    function createBreakBranch(topNode, marginLeft, width, direction) {
        var div = document.createElement('div');
        div.className = 'break-branch down';
        div.style.marginLeft = marginLeft + 'px';
        div.style.width = width + 'px';

        var html = '';
        if (direction === 'left') {
            html = ''
                + '<div class="branch-left branch-left1"></div>'
                + '<div class="branch-middle branch-middle1" style="width: '
                +   width
                + 'px;"></div>';
        }
        else {
            html = ''
                + '<div class="branch-middle branch-middle1" style="width: '
                +   width
                + 'px;"></div>'
                + '<div class="branch-right branch-right1" style="margin-left: '
                +   width
                + 'px"></div>';
        }

        div.innerHTML = html;

        // mozAnimationEnd oAnimationEnd oanimationend animationend
        // div.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        // div.addEventListener('animationend', breakBranchAniEnd);

        topNode.appendChild(div);
    }

    /**
     * 点击屏幕放下木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();

        var topNode = document.querySelector('.first');

        var transform = window.getComputedStyle(topNode).transform || window.getComputedStyle(topNode).webkitTransform;

        var translateX = 0;
        var match = transform.match(/matrix\(1, 0, 0, 1, (.*),[\s\S]*/);
        if (match) {
            translateX = match[1];
        }

        // 手百下添加 -webkit-animation-play-state: paused 无效~~~
        // topNode.classList.add('paused');

        topNode.classList.remove('swing');

        // 木头落下的左偏移，如果小于 -135，那么就截断左边的，否则截断右边的
        // 因为 margin-left: 135px 是居中的值，所以用 -135 来计算
        // 截取的那个小碎木头的宽度就是 -135 和 marginLeftOffset 的差值的绝对值
        var marginLeftOffset = (translateX - MARGIN_LEFT) | 0;

        var topNodeStyle = topNode.style;

        topNodeStyle.marginLeft = marginLeftOffset + 'px';
        topNodeStyle.transform = 'translateY(23px)';
        topNodeStyle.webkitTransform = 'translateY(23px)';

        topNode.classList.remove('first');

        offsetTop = parseInt(topNodeStyle.top) + BASE_DROPED_DISTANCE;

        // 截取的小木头碎片的宽度
        var width = 0;
        if (marginLeftOffset > (-MARGIN_LEFT)) {
            width = abs(marginLeftOffset - (-MARGIN_LEFT));
        }
        else {
            width = abs((-MARGIN_LEFT) - marginLeftOffset);
        }

        branchMiddleWidth = branchMiddleWidth - width;

        create(offsetTop - BASE_SWING_DISTANCE, branchMiddleWidth);

        topNodeStyle.marginLeft = marginLeftOffset + width + 'px';

        var childNodes = topNode.childNodes;
        var length = childNodes.length;
        var i = -1;
        while (++ i < length) {
            var node = childNodes[i];
            if (node.classList.contains('branch-middle')) {
                node.style.width = branchMiddleWidth + 'px';
            }

            if (node.classList.contains('branch-right')) {
                node.style.marginLeft = branchMiddleWidth + 'px';
            }
        }

        function createBreakBranch1(topNode, width, top, direction) {
            var div = document.createElement('div');
            div.className = 'break-branch down';
            div.style.marginLeft = -MARGIN_LEFT - width + 'px';
            div.style.width = width + 'px';
            div.style.top = top + 'px';
            direction = direction || 'left';
            var html = '';
            if (direction === 'left') {
                html = ''
                    + '<div class="branch-left branch-left1"></div>'
                    + '<div class="branch-middle branch-middle1" style="width: '
                    +   width
                    + 'px;"></div>';
            }
            else {
                html = ''
                    + '<div class="branch-middle branch-middle1" style="width: '
                    +   width
                    + 'px;"></div>'
                    + '<div class="branch-right branch-right1" style="margin-left: '
                    +   width
                    + 'px"></div>';
            }
            div.innerHTML = html;
            topNode.parentNode.appendChild(div);
        }

        createBreakBranch1(topNode, width, parseInt(topNodeStyle.top, 10) + 23);


        // var direction = 'left';
        // var width = -MARGIN_LEFT - marginLeftOffset;

        // topNodeStyle.marginLeft = -MARGIN_LEFT + 'px';
        // // topNodeStyle.marginLeft = -MARGIN_LEFT + width + 'px';
        // if (marginLeftOffset > -MARGIN_LEFT) {
        //     direction = 'right';
        //     width = marginLeftOffset - (-MARGIN_LEFT);
        //     // 260 是 branch-middle 的宽度，减去 10 是因为没有 branch-left，而 branch-left 的宽度是 10
        //     marginLeftOffset = branchMiddleWidth / 2 - branchLeftWidth / 2 - width;
        //     topNodeStyle.marginLeft = -MARGIN_LEFT + width + 'px';
        // }
        // else {
        //     MARGIN_LEFT = -parseInt(topNodeStyle.marginLeft, 10);
        // }

        // // console.warn(width);
        // // console.warn(topNode);
        // // console.warn(topNodeStyle.marginLeft);


        // // console.warn(MARGIN_LEFT);

        // // console.warn(topNode.childNodes);
        // // console.warn(document.querySelector('.branch-middle', topNode));
        // // console.warn(marginLeftOffset, width);
        // createBreakBranch(topNode, marginLeftOffset, width, direction);
        // create(offsetTop - BASE_SWING_DISTANCE, branchMiddleWidth - width);

        // var childNodes = topNode.childNodes;
        // var length = childNodes.length;
        // var i = -1;
        // while (++ i < length) {
        //     var node = childNodes[i];
        //     if (direction === 'left') {
        //         if (node.classList.contains('branch-middle')) {
        //             node.style.width = branchMiddleWidth - width + 'px';
        //         }

        //         if (node.classList.contains('branch-right')) {
        //             node.style.marginLeft = branchMarginLeft - width + 'px';
        //         }
        //     }
        //     else {
        //         if (node.classList.contains('branch-middle')) {
        //             node.style.width = branchMiddleWidth - width + 'px';
        //         }

        //         if (node.classList.contains('branch-right')) {
        //             node.style.marginLeft = branchMarginLeft - width + 'px';
        //         }
        //     }
        // }
    }

    var exports = {};

    exports.init = function () {
        startNode.addEventListener(globalData.touchStartEvent, startGame);

        document.body.addEventListener(globalData.touchStartEvent, dropBranch);

        offsetTop = document.querySelector('.branch-item').offsetTop;

        create(offsetTop - BASE_SWING_DISTANCE, branchMiddleWidth);
    };

    return exports;

});
