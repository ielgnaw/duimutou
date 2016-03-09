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
     * 点击屏幕落下木头
     *
     * @param {Object} e 事件对象
     */
    function dropBranch(e) {
        e.stopPropagation();
        e.preventDefault();
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
        startNode.addEventListener(globalData.touchStartEvent, startGame);
        doc.body.addEventListener(globalData.touchStartEvent, dropBranch);

        var offsetTop = document.querySelector('.branch-item').offsetTop;
        branch = new Branch({
            x: globalData.width - config.branchWidth,
            // x: 0,
            y: offsetTop - config.swingBranchTop,
            vx: 1,
            width: config.branchWidth
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
