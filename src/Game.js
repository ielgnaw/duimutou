/**
 * @file 游戏类
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var util = require('./util');
    var Event = require('./Event');

    function Game() {
        this.sprites = [];
        this.timer = null;
    }

    var p = Game.prototype;

    p.render = function () {
        var me = this;
        (function _go () {
            var sprites = me.sprites;
            me.sprites = [];
            var length = sprites.length;
            var i = -1;
            while (++i < length) {
                var sprite = sprites[i];
                if (sprite.status !== -1) {
                    var sprite = sprites[i];
                    me.sprites.push(sprite);
                    sprite.move();
                }
            }
            me.timer = window.requestAnimationFrame(_go);
        })();
    };

    p.addSprite = function (sprite) {
        this.sprites.push(sprite);
        this.fire('addSprite', sprite);
    };

    p.removeSprite = function (sprite, callback) {
        sprite.status = -1;
        sprite._after_remove = callback;
        sprite.fire('removeSprite', sprite);
    };

    util.inherits(Game, Event);

    return Game;

});
