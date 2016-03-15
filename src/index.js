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
    var floor = Math.floor;

    var guideNode = doc.querySelector('.guide-tip');
    var startNode = doc.querySelector('.start');
    var gameNode = doc.querySelector('.game-content');
    var containerNode = doc.querySelector('.branch-wrapper');
    var scoreNode = doc.querySelector('.score-panel .left span');
    var sequenceNode = doc.querySelector('.score-panel .right span');
    var levelNode = doc.querySelector('.score-panel .middle span');
    var endNode = doc.querySelector('.end');
    var endInfoNode = doc.querySelector('.end .info');
    var endPlayNode = doc.querySelector('.end .play-again');

    /**
     * 得高分的连击数
     *
     * @type {number}
     */
    var sequenceHigh = 0;

    /**
     * 级别
     *
     * @type {number}
     */
    var level = 1;

    /**
     * 所有已经落下的木头的数量
     *
     * @type {number}
     */
    var allDownBranchSum = 0;

    /**
     * 木头的左右摆动速度，初始为 3
     *
     * @type {numner}
     */
    var vx = 3;

    /**
     * 左边落下破碎的小木头动画结束的回调函数
     *
     * @param {Object} e 事件对象
     */
    function breakBranchAniEnd(e) {
        var target = e.target || e.srcElement;
        target.parentNode.removeChild(target);

        doc.body.addEventListener(globalData.touchStartEvent, dropBranch);

        if (allDownBranchSum % 5 === 0) {
            levelNode.innerHTML = +levelNode.innerHTML + 1;
            vx += 2;
        }
    }

    /**
     * 游戏开始回调函数
     *
     * @param {Object} e 事件对象
     */
    function startGame(e) {
        e.stopPropagation();
        e.preventDefault();
        endNode.style.display = 'none';
        guideNode.style.display = 'none';
        gameNode.style.display = 'block';

        doc.body.addEventListener(globalData.touchStartEvent, dropBranch);

        scoreNode.addEventListener('webkitAnimationEnd', function (e) {
            scoreNode.classList.remove('shake');
        });
        scoreNode.addEventListener('animationend', function (e) {
            scoreNode.classList.remove('shake');
        });

        var offsetTop = doc.querySelector('.branch-item').offsetTop;

        branch = new Branch({
            x: 0,
            y: offsetTop - config.swingBranchTop,
            vx: vx,
            width: curBranchWidth
        });

        var fpsNode = doc.querySelector('.fps');

        game.addSprite({
            count: 0,
            move: function () {
                var fps = util.fps();
                if (++this.count === 10) {
                    this.count = 0;
                    fpsNode.innerHTML = 'FPS: ' + fps;
                }
            }
        });
        game.addSprite(branch);
        game.render();
    }

    /**
     * 记录当前的木头的宽度，初始时是默认的宽度
     *
     * @type {number}
     */
    var curBranchWidth = config.defaultBranchWidth;

    /**
     * 截断木头
     *
     * @param {number} breakBranchWidth 截断的小木头的宽度
     * @param {string} direction 方向
     */
    function cut(breakBranchWidth, direction) {
        direction = direction || 'left';

        var breakBranchNode = document.createElement('div');
        breakBranchNode.className = 'break-branch down';

        var breakBranchNodeStyle = breakBranchNode.style;

        var newBranchX = 0;

        // 在左侧的截断
        if (direction === 'left') {
            breakBranchNodeStyle.marginLeft = branch.x + 'px';
            breakBranchNodeStyle.width = breakBranchWidth + 'px';
            breakBranchNodeStyle.top = branch.y + 'px';
            breakBranchNode.innerHTML = ''
                    + '<div class="branch-left branch-left1"></div>'
                    + '<div class="branch-middle branch-middle1" style="width: '
                    +   breakBranchWidth
                    + 'px;"></div>';

            curBranchWidth -= breakBranchWidth;
            branch.vx = 0;

            branch.dom.style.marginLeft = breakBranchWidth + 'px';
            branch.dom.setAttribute('data-left', branch.x + breakBranchWidth);
            branch.dom.setAttribute('data-right', branch.x + breakBranchWidth + curBranchWidth);

            newBranchX = globalData.width - curBranchWidth;
        }
        // 在右侧的截断
        else {
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

            curBranchWidth -= breakBranchWidth;
            branch.vx = 0;

            branch.dom.setAttribute('data-left', branch.x);
            branch.dom.setAttribute('data-right', branch.x + curBranchWidth);
        }

        breakBranchNode.addEventListener('webkitAnimationEnd', breakBranchAniEnd);
        breakBranchNode.addEventListener('animationend', breakBranchAniEnd);
        containerNode.appendChild(breakBranchNode);

        // 这一句要在 new Branch 之前
        branch.changeStyle(breakBranchWidth);

        if (allDownBranchSum + 1 > config.maxBranchNum) {
            var transform = getComputedStyle(containerNode).transform
                || getComputedStyle(containerNode).webkitTransform;
            containerNode.style.transform =
            containerNode.style.webkitTransform =
                'translateY(' + 20 * (allDownBranchSum + 1 - config.maxBranchNum) + 'px)';

            // 这个 500ms 是和 .go-down 的动画 500ms 对应的
            var t = setTimeout(function () {
                clearTimeout(t);
                var first = document.querySelector('.branch-wrapper .branch-item');
                if (first.branch) {
                    game.removeSprite(first.branch);
                }
            }, 0);
        }

        branch = new Branch({
            x: newBranchX,
            y: offsetTop - config.swingBranchTop,
            vx: vx,
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
        doc.body.removeEventListener(globalData.touchStartEvent, dropBranch);

        offsetTop = branch.y += config.dropDistance;

        var prevDom = util.getPrev(branch.dom);
        var dataLeft = prevDom.getAttribute('data-left') | 0;
        var dataRight = dataLeft + curBranchWidth;

        // 挂逼了，右边
        if (branch.x > dataRight) {
            dead();
        }
        else if (branch.x + branch.width < dataLeft) {
            dead();
        }
        else {
            allDownBranchSum++;

            var score = 0;

            var breakBranchWidth = dataLeft - branch.x;

            // 给 3px 的误差，让得高分更容易
            // 左
            if (breakBranchWidth - 0 > 0) {
                cut(breakBranchWidth, 'left');
                score = 10;
            }
            // 右
            else if (breakBranchWidth + 0 < 0) {
                breakBranchWidth = branch.x + curBranchWidth - (dataLeft + curBranchWidth);
                cut(breakBranchWidth, 'right');
                score = 10;
            }
            else {
                cut(0, 'right');
                score = 50;
                scoreNode.classList.add('shake');
                sequenceHigh = sequenceHigh + 1;
            }
            scoreNode.innerHTML = +scoreNode.innerHTML + score;
            sequenceNode.innerHTML = sequenceHigh;
        }
    }

    /**
     * 游戏结束
     */
    function dead() {
        game.stop();
        endNode.style.display = 'block';
        endInfoNode.innerHTML = ''
            + '本次得分 '
            + scoreNode.innerHTML
            + '，最大连击数 '
            + sequenceNode.innerHTML
            + '。';
        document.title = ''
            + '我在堆木头中得到 '
            + scoreNode.innerHTML
            + '分，最大连击数 '
            + sequenceNode.innerHTML
            + '。你也来试试吧~~~';
    }

    function playAgain(e) {
        document.title = '堆木头';
        game = new Game();
        curBranchWidth = config.defaultBranchWidth;
        containerNode.style.transform =
        containerNode.style.webkitTransform = 'translateY(0)';
        var all = doc.querySelectorAll('.branch-wrapper .branch-item');
        for (var i = 0, len = all.length; i < len; i++) {
            if (!all[i].classList.contains('base')) {
                all[i].parentNode.removeChild(all[i]);
            }
        }

        // 还原一些设置以及得分什么的
        sequenceHigh = 0;
        sequenceNode.innerHTML = sequenceHigh;

        level = 1;
        levelNode.innerHTML = level;

        allDownBranchSum = 0;
        vx = 3;
        scoreNode.innerHTML = 0;

        startGame(e);
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
        var baseNode = doc.querySelector('.base');
        var baseNodeStyle = baseNode.style;
        baseNodeStyle.webkitTransform = baseNodeStyle.transform = ''
            + 'translate3d('
            +   (globalData.width - curBranchWidth) / 2
            + 'px, 0, 0)';

        baseNode.setAttribute('data-left', (globalData.width - curBranchWidth) / 2);
        baseNode.setAttribute('data-right', (globalData.width - curBranchWidth) / 2 + curBranchWidth);

        startNode.addEventListener(globalData.touchStartEvent, startGame);

        endPlayNode.addEventListener(globalData.touchStartEvent, playAgain);
    };

    return exports;

});
