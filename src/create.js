/**
 * @file 创建木头
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var TPL = ''
        + '<div class="branch-item swing last" style="top: ${top}px;">'
        +   '<div class="branch-left"></div>'
        +   '<div class="branch-middle"></div>'
        +   '<div class="branch-right"></div>'
        + '</div>';

    var container = document.querySelector('.branch-container');

    return function (top) {
        var div = document.createElement('div');
        div.innerHTML = TPL.replace('${top}', top);
        container.appendChild(div.childNodes[0]);
    };

});
