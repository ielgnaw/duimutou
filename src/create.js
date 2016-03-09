/**
 * @file 创建木头
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var util = require('./util');

    function ZIndexQueen() {
        this.items = [15, 20];
        // 当前索引
        this.index = -1;
    }

    var p = ZIndexQueen.prototype;

    /**
     * 正序获取队列的下一个元素，默认从头开始
     * 如果已经到队列最后一个元素，那么下一个元素就是队列第一个元素
     *
     * @return {*} 队列元素
     */
    p.pick = function () {
        this.index++;
        if (this.index === this.items.length) {
            this.index = 0;
        }

        return this.items[this.index];
    };

    var zIndexQueen = new ZIndexQueen();

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

    return function (opts) {
        var div = document.createElement('div');
        var clsRandom = util.randomInt(1, 4);
        div.innerHTML = util.render(TPL, {
            clsRandom: clsRandom,
            itemWidth: opts.itemWidth,
            top: opts.top,
            zIndex: zIndexQueen.pick(),
            middleWidth: opts.middleWidth,
            translateX: opts.translateX
        });

        container.appendChild(div.childNodes[0]);
    };

    // var TPL = ''
    //     + '<div class="branch-item swing current" data-clsrandom="${clsRandom}" style="'
    //     +   'width: ${width1}px;top: ${top}px; z-index: ${zIndex}; margin-left: ${marginLeft1}px;">'
    //     +   '<div class="branch-left branch-left${clsRandom}"></div>'
    //     +   '<div class="branch-middle branch-middle${clsRandom}" style="width: ${width}px;"></div>'
    //     +   '<div class="branch-right branch-right${clsRandom}" style="margin-left: ${marginLeft}px;"></div>'
    //     + '</div>';

    // var container = document.querySelector('.branch-container');

    // return function (top, width, marginLeft) {
    //     var div = document.createElement('div');
    //     var clsRandom = util.randomInt(1, 4);
    //     var ml = marginLeft;
    //     if (marginLeft === void 0) {
    //         ml = -135;
    //     }
    //     div.innerHTML = TPL.replace('${top}', top)
    //         .replace('${zIndex}', zIndexQueen.pick())
    //         .replace('${marginLeft1}', ml)
    //         .replace('${marginLeft}', width)
    //         .replace(/\$\{width\}/g, width)
    //         .replace(/\$\{width1\}/g, width + 10)
    //         .replace(/\$\{clsRandom\}/g, clsRandom);
    //     container.appendChild(div.childNodes[0]);
    // };

});
