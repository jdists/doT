"use strict";
var doT = require("dot");
module.exports = (function (content, attrs, scope) {
    if (!content) {
        return content;
    }
    var render = doT.compile(content);
    var data = null;
    if (attrs.data) {
        data = scope.execImport(attrs.data);
    }
    return render(data);
});
