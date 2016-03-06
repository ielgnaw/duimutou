/**
 * @file 创建木头
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

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

    /**
     * 生成 min 到 max 范围内的随机整数
     *
     * @param {number} min 最小值
     * @param {number} max 最大值
     *
     * @return {number} min 到 max 之间的随机整数
     */
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var TPL = ''
        + '<div class="branch-item swing current" data-clsrandom="${clsRandom}" style="'
        +   'width: ${width1}px;top: ${top}px; z-index: ${zIndex}; margin-left: ${marginLeft1}px;">'
        +   '<div class="branch-left branch-left${clsRandom}"></div>'
        +   '<div class="branch-middle branch-middle${clsRandom}" style="width: ${width}px;"></div>'
        +   '<div class="branch-right branch-right${clsRandom}" style="margin-left: ${marginLeft}px;"></div>'
        + '</div>';

    var container = document.querySelector('.branch-container');

    return function (top, width, marginLeft) {
        var div = document.createElement('div');
        var clsRandom = randomInt(1, 4);
        div.innerHTML = TPL.replace('${top}', top)
            .replace('${zIndex}', zIndexQueen.pick())
            .replace('${marginLeft1}', marginLeft || -135)
            .replace('${marginLeft}', width)
            .replace(/\$\{width\}/g, width)
            .replace(/\$\{width1\}/g, width + 10)
            .replace(/\$\{clsRandom\}/g, clsRandom);
        container.appendChild(div.childNodes[0]);
    };

});
