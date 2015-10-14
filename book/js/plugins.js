$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// zmiana domyślnych placeholderów na wygodniejsze
_.templateSettings = {
    evaluate    : /\{\{(.+?)\}\}/g,   // placeholder funkcyjny
    interpolate : /\{\{=(.+?)\}\}/g,  // placeholder treści
    escape      : /\{\{-(.+?)\}\}/g   // placeholder parsowany
};


_.mixin({templateFromUrl: function (url, data, settings) {
    var templateHtml = "";
    this.cache = this.cache || {};

    if (this.cache[url]) {
        templateHtml = this.cache[url];
    } else {
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            success: function(data) {
                templateHtml = data;
            }
        });

        this.cache[url] = templateHtml;
    }

    return _.template(templateHtml, data, settings);
}});

function reverseSortBy(sortByFunction) {
    return function(left, right) {
        var l = sortByFunction(left);
        var r = sortByFunction(right);

        if (l === void 0) return -1;
        if (r === void 0) return 1;

        return l < r ? 1 : l > r ? -1 : 0;
    };
};