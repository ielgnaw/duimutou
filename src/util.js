/**
 * @file 工具方法
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var getComputedStyle = window.getComputedStyle;

    var transformReg = /matrix\(1, 0, 0, 1, (.*),[\s\S]*/;

    var REG = /(?:\{\{)([a-zA-Z][^\s\}]+)(?:\}\})/g;

    var exports = {};

    /**
     * 最简单的模板
     *
     * @param {string} template 模板
     * @param {Object} data 数据
     *
     * @return {string} 编译后的模板
     */
    exports.render = function (template, data) {
        return template.replace(REG, function (fullMatch, capture) {
            var d = data[capture];
            if (d !== null && d !== void 0) {
                return data[capture];
            }
            return fullMatch;
        });
    };

    /**
     * 根据 keyframes name 找到对应的 keyframes
     *
     * @param {string} rule keyframes 名称
     *
     * @return {Object} keyframes 对象
     */
    exports.findKeyframesRule = function (rule) {
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
    };

    /**
     * 获取节点的 translateX，由于是想要获取最终的那个对应的距离，所以获取的是相反数
     *
     * @param {HTML Element} node html 节点
     *
     * @return {number} transformX 的值
     */
    exports.getTranslateX = function (node) {
        var transform = getComputedStyle(node).transform || getComputedStyle(node).webkitTransform;

        var match = transform.match(transformReg);
        if (match) {
            return match[1] | 0;
        }

        return 0;
    };

    /**
     * 生成 min 到 max 范围内的随机整数
     *
     * @param {number} min 最小值
     * @param {number} max 最大值
     *
     * @return {number} min 到 max 之间的随机整数
     */
    exports.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * 为类型构造器建立继承关系
     *
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @return {Function} 返回 subClass 构造器
     */
    exports.inherits = function (subClass, superClass) {

        var Empty = function () {};
        Empty.prototype = superClass.prototype;
        var selfPrototype = subClass.prototype;
        var proto = subClass.prototype = new Empty();

        for (var key in selfPrototype) {
            if (selfPrototype.hasOwnProperty(key)) {
                proto[key] = selfPrototype[key];
            }
        }
        subClass.prototype.constructor = subClass;

        subClass.superClass = superClass.prototype;

        return subClass;
    };

    /**
     * getTime polyfill
     *
     * @return {Function} getTime()
     */
    exports.getTimestamp = (function () {
        return Date.now || function () {
            return new Date().getTime();
        };
    })();

    /**
     * 获取 fps
     *
     * @return {number} fps
     */
    exports.fps = (function () {
        var last = 0;
        return function () {
            var cacheLast = last;
            var current = last = exports.getTimestamp();
            return Math.floor(1000 / (current - cacheLast))
        }
    })();

    return exports;

});
