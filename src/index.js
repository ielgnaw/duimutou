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

    function rightCut(width) {
        // var breakBranchTop = offsetTop = parseInt(currentNodeStyle.top) + config.dropDistance;
        var breakBranchNode = document.createElement('div');
        breakBranchNode.className = 'break-branch down';
        breakBranchNode.style.marginLeft = branch.x + branch.middleWidth - width + 'px';
        breakBranchNode.style.width = width + 'px';
        breakBranchNode.style.top = branch.top + config.dropDistance + 'px';
        breakBranchNode.innerHTML = ''
                + '<div class="branch-middle branch-middle1" style="width: '
                +   width
                + 'px;"></div>'
                + '<div class="branch-right branch-right1" style="margin-left: '
                +   width
                + 'px"></div>';

        breakBranchNode.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        breakBranchNode.addEventListener('animationend', breakBranchAniEnd);
        containerNode.appendChild(breakBranchNode);

        branch.changeStyle(width);
        console.warn(width);

        config.branchMiddleWidth -= width;
        // debugger
        branch = new Branch({
            // x: globalData.width - 270 + width,
            x: 0,
            breakBranchWidth: width,
            vx: 1,
            top: branch.top + config.dropDistance - config.swingBranchTop,
            itemWidth: config.branchMiddleWidth + 10,
            middleWidth: config.branchMiddleWidth,
        });
        game.addSprite(branch);
        console.warn(game);
    }

    var w = 0;

    /**
     * 点击屏幕放下木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();
        branch.vy = 3;
        branch.vx = 0;
        // 截取的小木头的宽度
        var width = 0;
        w += width / 2;
        if (branch.x > 70 + w) {
            // (globalData.width - branch.itemWidth) / 2 - (globalData.width - (branch.x + branch.itemWidth));
            // width = branch.x  - (globalData.width - branch.itemWidth) / 2;
            // width = branch.x + branch.itemWidth / 2 - globalData.width / 2;
            width = branch.itemWidth - (globalData.width / 2 - branch.x) - 270 / 2;
            rightCut(width);
        }
        else if (branch.x < 70 + w) {
            // (globalData.width - branch.itemWidth) / 2 - branch.x;
            width = (globalData.width - branch.itemWidth) / 2 - branch.x;
            console.warn('zuo');
        }
        else {
            console.warn('niubi');
        }
        w += width;
    }

    /**
     * 落下的木头中最上方的那个木头的垂直偏移距离，作为下一个木头落下的基准
     *
     * @type {number}
     */
    var offsetTop = 0;

    var branch;

    var game = new Game();

    var exports = {};

    /**
     * 初始化
     */
    exports.init = function () {
        startNode.addEventListener(globalData.touchStartEvent, startGame);

        document.body.addEventListener(globalData.touchStartEvent, dropBranch);

        offsetTop = document.querySelector('.branch-item').offsetTop;

        branch = new Branch({
            x: globalData.width - 270,
            // x: 0,
            vx: 1,
            top: offsetTop - config.swingBranchTop,
            itemWidth: config.branchMiddleWidth + 10,
            middleWidth: config.branchMiddleWidth,
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

        game.render();

        // setTimeout(function () {
        //     game.removeSprite(branch)
        //     console.log(game);
        // }, 5000);

    };

    return exports;

});
