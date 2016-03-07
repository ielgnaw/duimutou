/**
 * @file Description
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global globalData*/

define(function (require) {

    var create = require('./create');
    var config = require('./config');

    var doc = document;
    var abs = Math.abs;

    var guideNode = doc.querySelector('.guide-tip');
    var startNode = doc.querySelector('.start');
    var gameNode = doc.querySelector('.game-content');

    /**
     * 根据 keyframes name 找到对应的 keyframes
     *
     * @param {string} rule keyframes 名称
     *
     * @return {Object} keyframes 对象
     */
    function findKeyframesRule(rule) {
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; ++i) {
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE
                    && ss[i].cssRules[j].name == rule
                ) {
                    return ss[i].cssRules[j];
                }
            }
        }
        return null;
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
     * 点击屏幕放下木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();

        // 当前左右摇摆的那个木头
        var currentNode = document.querySelector('.current');

        var transform = window.getComputedStyle(currentNode).transform || window.getComputedStyle(currentNode).webkitTransform;

        var translateX = 0;
        var match = transform.match(/matrix\(1, 0, 0, 1, (.*),[\s\S]*/);
        if (match) {
            translateX = match[1] | 0;
        }

        // 手百下添加 -webkit-animation-play-state: paused 无效~~~
        // currentNode.classList.add('paused');

        currentNode.classList.remove('swing');

        // 木头落下的左偏移，如果小于 -135，那么就截断左边的，否则截断右边的
        // 因为 margin-left: 135px 是居中的值，所以用 -135 来计算
        // 截取的那个小碎木头的宽度就是 -135 和 marginLeftOffset 的差值的绝对值
        var marginLeftOffset = (translateX + config.centerMarginLeft) | 0;
        if (translateX > 0) {
            rightCut(currentNode, marginLeftOffset, translateX);
        }
        else {
            leftCut(currentNode, marginLeftOffset, translateX);
        }
    }

    // var test = 50;

    function leftCut(currentNode, marginLeftOffset, translateX) {
        currentNode.classList.remove('current');
        var currentNodeStyle = currentNode.style;
        // console.warn(currentNode, marginLeftOffset, translateX);
        // currentNodeStyle.marginLeft = marginLeftOffset + 'px';
        currentNodeStyle.transform = 'translateY(23px)';
        currentNodeStyle.webkitTransform = 'translateY(23px)';

        // 截取的小木头碎片的宽度
        var width = abs(config.centerMarginLeft - marginLeftOffset);
        console.warn('截取的小木头碎片的宽度', width);
        currentNodeStyle.width = config.branchMiddleWidth - width + 10 + 'px';

        var childNodes = currentNode.childNodes;
        var length = childNodes.length;
        var i = -1;
        while (++ i < length) {
            var node = childNodes[i];
            if (node.classList.contains('branch-middle')) {
                node.style.width = config.branchMiddleWidth - width + 'px';
            }

            if (node.classList.contains('branch-right')) {
                node.style.marginLeft = config.branchMiddleWidth - width + 'px';
            }
        }

        // 要创建的破碎的木头的 top 值
        var breakBranchTop = offsetTop = parseInt(currentNodeStyle.top) + config.dropDistance;
        var breakBranchNode = document.createElement('div');
        breakBranchNode.className = 'break-branch down';
        breakBranchNode.style.marginLeft = marginLeftOffset + 'px';
        breakBranchNode.style.width = width + 'px';
        breakBranchNode.style.top = breakBranchTop + 'px';
        breakBranchNode.innerHTML = ''
                + '<div class="branch-left branch-left1"></div>'
                + '<div class="branch-middle branch-middle1" style="width: '
                +   width
                + 'px;"></div>';

        breakBranchNode.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        breakBranchNode.addEventListener('animationend', breakBranchAniEnd);
        currentNode.parentNode.appendChild(breakBranchNode);

        config.branchMiddleWidth = config.branchMiddleWidth - width;
        create(offsetTop - config.swingBranchTop, config.branchMiddleWidth);
    }

    function rightCut(currentNode, marginLeftOffset, translateX) {
        currentNode.classList.remove('current');
        var currentNodeStyle = currentNode.style;
        // console.warn(marginLeftOffset, translateX);
        // currentNodeStyle.marginLeft = marginLeftOffset + 'px';
        currentNodeStyle.transform = 'translateY(23px)';
        currentNodeStyle.webkitTransform = 'translateY(23px)';

        // 截取的小木头碎片的宽度
        // translateX 就是 小木头的宽度？？？
        var width = abs(config.centerMarginLeft - marginLeftOffset);
        console.warn('截取的小木头碎片的宽度', width);
        currentNodeStyle.width = config.branchMiddleWidth - width + 10 + 'px';
        currentNodeStyle.marginLeft = config.centerMarginLeft + width + 'px';

        var childNodes = currentNode.childNodes;
        var length = childNodes.length;
        var i = -1;
        while (++ i < length) {
            var node = childNodes[i];
            if (node.classList.contains('branch-middle')) {
                node.style.width = config.branchMiddleWidth - width + 'px';
            }

            if (node.classList.contains('branch-right')) {
                node.style.marginLeft = config.branchMiddleWidth - width + 'px';
            }
        }
        // debugger
        // 要创建的破碎的木头的 top 值
        var breakBranchTop = offsetTop = parseInt(currentNodeStyle.top) + config.dropDistance;
        var breakBranchNode = document.createElement('div');
        breakBranchNode.className = 'break-branch down';
        breakBranchNode.style.marginLeft = marginLeftOffset + config.branchMiddleWidth - width + 'px';
        breakBranchNode.style.width = width + 'px';
        breakBranchNode.style.top = breakBranchTop + 'px';
        breakBranchNode.innerHTML = ''
                + '<div class="branch-middle branch-middle1" style="width: '
                +   width
                + 'px;"></div>'
                + '<div class="branch-right branch-right1" style="margin-left: '
                +   width
                + 'px"></div>';

        breakBranchNode.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        breakBranchNode.addEventListener('animationend', breakBranchAniEnd);
        currentNode.parentNode.appendChild(breakBranchNode);

        // var nextBranchMarginLeft = -(config.branchMiddleWidth - width + 10 + config.centerMarginLeft);
        var nextBranchMarginLeft = -(config.branchMiddleWidth - width + 10 + config.centerMarginLeft);

        config.branchMiddleWidth = config.branchMiddleWidth - width;
        create(offsetTop - config.swingBranchTop, config.branchMiddleWidth, nextBranchMarginLeft);

        // for (var i = 0; i < document.styleSheets[0]['cssRules'].length; i += 1) {
        //     var rule = document.styleSheets[0]['cssRules'][i];
        //     // console.warn(rule.name);
        //     if (rule.name === 'swing') {
        //         // rule.cssText = 1;
        //         console.warn(rule);
        //     }
        // }

        // findKeyframesRule('swing').deleteRule('0%');
        // findKeyframesRule('swing').deleteRule('100%');
        // findKeyframesRule('swing').appendRule(''
        //     + '0% {-webkit-transform: translateX(' + test + 'px) translateZ(0);transform: translateX(' + test + 'px) translateZ(0);}'
        // );
        // findKeyframesRule('swing').appendRule(''
        //     + '100% {-webkit-transform: translateX(' + -test + 'px) translateZ(0);transform: translateX(' + -test + 'px) translateZ(0);}'
        // )
    }

    var exports = {};

    /**
     * 初始化
     */
    exports.init = function () {
        startNode.addEventListener(globalData.touchStartEvent, startGame);

        document.body.addEventListener(globalData.touchStartEvent, dropBranch);

        offsetTop = document.querySelector('.branch-item').offsetTop;

        create(offsetTop - config.swingBranchTop, config.branchMiddleWidth);
    };

    return exports;

});
