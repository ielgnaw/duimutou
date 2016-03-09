/**
 * @file 木头类
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var util = require('./util');
    var Event = require('./Event');

    /**
     * zIndex 的队列类，用于交替设置 z-index
     */
    function ZIndexQueen() {
        this.items = [15, 20];
        // 当前索引
        this.index = -1;
    }

    /**
     * 正序获取队列的下一个元素，默认从头开始
     * 如果已经到队列最后一个元素，那么下一个元素就是队列第一个元素
     *
     * @return {*} 队列元素
     */
    ZIndexQueen.prototype.pick = function () {
        this.index++;
        if (this.index === this.items.length) {
            this.index = 0;
        }

        return this.items[this.index];
    };

    var container = document.querySelector('.branch-container');
    var TPL = ''
        + '<div class="branch-item swing current" data-clsrandom="{{clsRandom}}" style="'
        +   'width: {{itemWidth}}px;top: {{top}}px; z-index: {{zIndex}}; '
        +   '-webkit-transform: translateX({{translateX}}px) translateZ(0); '
        +   'transform: translateX({{translateX}}px) translateZ(0);">'
        +   '<div class="branch-left branch-left{{clsRandom}}"></div>'
        +   '<div class="branch-middle branch-middle{{clsRandom}}" style="width: {{middleWidth}}px;"></div>'
        +   '<div class="branch-right branch-right{{clsRandom}}" style="margin-left: {{middleWidth}}px;"></div>'
        + '</div>';

    var delta = 1000 / 60;

    var zIndexQueen = new ZIndexQueen();

    /**
     * 木头类
     */
    function Branch(opts) {
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.vx = opts.vx || 0;
        this.vy = opts.vy || 0;
        this.then = null;
        this.accumulateTime = null;
        this.itemWidth = opts.itemWidth || 0;
        this.middleWidth = opts.middleWidth || 0;
        this.status = 1;

        this._create();

        this.dom = document.querySelector('.current');
        this.domStyle = this.dom.style;

        this.on('removeSprite', function () {
            this.dom.parentNode.removeChild(this.dom);
        });
    }

    var p = Branch.prototype;

    p._create = function (opts) {
        var div = document.createElement('div');
        var clsRandom = util.randomInt(1, 4);
        div.innerHTML = util.render(TPL, {
            clsRandom: clsRandom,
            itemWidth: this.itemWidth,
            middleWidth: this.middleWidth,
            translateX: this.x,
            top: this.y,
            zIndex: zIndexQueen.pick()
        });

        container.appendChild(div.childNodes[0]);
    };

    p.move = function () {
        var now;
        var passed;
        if (!this.then) {
            this.accumulateTime = 0;
            return this.then = util.getTimestamp();
        }
        now = util.getTimestamp();
        passed = now - this.then;
        this.accumulateTime += passed;
        while (this.accumulateTime > delta) {
            this.update();
            this.accumulateTime -= delta;
        }
        this.then = now;
        this.draw();
        return this;
    };

    p.update = function () {
        this.x += this.vx;
        this.y += this.vy;

        if ((this.x > globalData.width - 275) || (this.x <= 0)) {
            this.vx = -this.vx;
        }
    };

    p.draw = function () {
        this.domStyle.transform = 'translateX(' + this.x + 'px) translateY(0) translateZ(0)';
        this.domStyle.webkitTransform = 'translateX(' + this.x + 'px) translateY(0) translateZ(0)';
    };

    util.inherits(Branch, Event);

    return Branch;

});
