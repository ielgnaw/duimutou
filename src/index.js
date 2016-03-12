/**
 * @file Description
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global globalData*/

define(function (require) {

    var config = require('./config');
    var util = require('./util');
    var Game = require('./Game');
    var Branch = require('./branch');

    var doc = document;

    var guideNode = doc.querySelector('.guide-tip');
    var startNode = doc.querySelector('.start');
    var gameNode = doc.querySelector('.game-content');
    var containerNode = doc.querySelector('.branch-container');

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

    var curBranchWidth = config.defaultBranchWidth;

    function rightCut(breakBranchWidth) {
        var breakBranchNode = document.createElement('div');
        breakBranchNode.className = 'break-branch down';

        var breakBranchNodeStyle = breakBranchNode.style;
        breakBranchNodeStyle.marginLeft = (curBranchWidth - breakBranchWidth - 10 + branch.x) + 'px';
        breakBranchNodeStyle.width = breakBranchWidth + 'px';
        breakBranchNodeStyle.top = branch.y + 'px';
        breakBranchNode.innerHTML = ''
                + '<div class="branch-middle branch-middle1" style="width: '
                +   breakBranchWidth
                + 'px;"></div>'
                + '<div class="branch-right branch-right1" style="margin-left: '
                +   breakBranchWidth
                + 'px"></div>';

        breakBranchNode.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        breakBranchNode.addEventListener('animationend', breakBranchAniEnd);
        containerNode.appendChild(breakBranchNode);

        curBranchWidth -= breakBranchWidth;
        branch.vx = 0;

        branch = new Branch({
            x: globalData.width - curBranchWidth,
            // x: 0,
            y: offsetTop - config.swingBranchTop,
            vx: 1,
            width: curBranchWidth
        });

        game.addSprite(branch);
    }

    /**
     * 点击屏幕落下木头
     * 落下木头，并改变宽度
     * 创建破碎的小木头，并添加小木头落下的动画
     * 创建新的摇摆的木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();

        offsetTop = branch.y += config.dropDistance;

        // 截取的小木头的宽度，如果是负值，说明要截取的小木头在左边
        // var breakBranchWidth = branch.x - (globalData.width - config.defaultBranchWidth) / 2;
        var breakBranchWidth = 0;
        if (breakBranchWidth > 0) {
            breakBranchWidth = branch.x + curBranchWidth - 72 - config.defaultBranchWidth;
            rightCut(breakBranchWidth);
        }
        else {
            breakBranchWidth = branch.x + curBranchWidth - 72 - config.defaultBranchWidth;
            rightCut(breakBranchWidth);
            console.warn(213);
        }
        branch.changeStyle(breakBranchWidth);
    }

    /**
     * 摇摆的木头对象
     */
    var branch;

    /**
     * Game 实例
     *
     * @type {Object}
     */
    var game = new Game();

    var exports = {};

    /**
     * 初始化
     */
    exports.init = function () {
        document.querySelector('.base').style.webkitTransform = ''
        document.querySelector('.base').style.transform = ''
            + 'translate3d('
            +   (globalData.width - curBranchWidth) / 2
            + 'px, 0, 0)';

        startNode.addEventListener(globalData.touchStartEvent, startGame);

        // 这句应该在 startGame 内部
        doc.body.addEventListener(globalData.touchStartEvent, dropBranch);

        var offsetTop = document.querySelector('.branch-item').offsetTop;

        branch = new Branch({
            // x: globalData.width - curBranchWidth,
            x: 0,
            y: offsetTop - config.swingBranchTop,
            vx: 1,
            width: curBranchWidth
        });

        game.addSprite({
            count: 0,
            move: function () {
                var fps = util.fps();
                if (++this.count === 10) {
                    this.count = 0;
                    document.querySelector('.left span').innerHTML = fps;
                    // console.warn(fps);
                }
            }
        });
        game.addSprite(branch);

        // game.render();

        // setTimeout(function () {
        //     game.removeSprite(branch)
        //     console.log(game);
        // }, 5000);

    };

    return exports;

});
