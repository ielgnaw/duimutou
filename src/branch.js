/**
 * @file 木头类
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var util = require('./util');
    var Event = require('./Event');
    var config = require('./config');

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
        + '<div class="branch-item current" data-clsrandom="{{clsRandom}}" style="'
        +   'width: {{itemWidth}}px; z-index: {{zIndex}}; '
        +   '-webkit-transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0); '
        +   'transform: translateX({{translateX}}px) translateY({{top}}px) translateZ(0);">'
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
        this.name = opts.name || util.getTimestamp();
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.vx = opts.vx || 0;
        this.vy = opts.vy || 0;
        this.then = null;
        this.accumulateTime = null;

        this.width = opts.width || 0;
        this.middleWidth = opts.middleWidth || (opts.width === 0 ? 0 : opts.width - 10);
        // this.top = opts.top || 0;
        this.status = 1;

        this._create();

        this.dom = document.querySelector('.current');
        this.domStyle = this.dom.style;

        this.on('removeSprite', function () {
            this.dom.parentNode.removeChild(this.dom);
        });
    }

    var p = Branch.prototype;

    p._create = function () {
        var div = document.createElement('div');
        var clsRandom = util.randomInt(1, 4);
        div.innerHTML = util.render(TPL, {
            clsRandom: clsRandom,
            itemWidth: this.width,
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

        if ((this.x > globalData.width - this.width) || (this.x <= 0)) {
            this.vx = -this.vx;
        }

        if (this.y >= config.dropDistance) {
            this.vy = 0;
        }
    };

    p.draw = function () {
        this.domStyle.webkitTransform =
        this.domStyle.transform = 'translateX(' + this.x + 'px) translateY(' + this.y + 'px) translateZ(0)';
        // this.domStyle.left = this.x + 'px';
    };

    p.changeStyle = function (width) {
        this.domStyle.width = this.width - width + 'px';
        var childNodes = this.dom.childNodes;
        var length = childNodes.length;
        var i = -1;
        while (++ i < length) {
            var node = childNodes[i];
            if (node.classList.contains('branch-middle')) {
                node.style.width = this.width - width - 10 + 'px';
            }

            if (node.classList.contains('branch-right')) {
                node.style.marginLeft = this.width - width - 10 + 'px';
            }
        }
        this.dom.classList.remove('current');
        this.domStyle.left = 0;
        this.domStyle.top = 0;
    };

    util.inherits(Branch, Event);

    return Branch;

});
