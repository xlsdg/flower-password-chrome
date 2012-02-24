var options = options || {};

(function() {
    var cache = {
        transparent: false,
        saveLastKey: true,
        fillKeyWithDomain: true,
        showHint: true,
        defaultEnabled: true,
        defaultAppendScramble: false,
        scramble: ''
    };

    options.global = {
        cache: cache,

        loadAll: function() {
            for (var name in cache) {
                if (isUndefined(localStorage[name])) {
                    options.global.set(name, cache[name]);
                } else {
                    cache[name] = JSON.parse(localStorage[name]);
                }
            }
        },
        set: function(name, value) {
            cache[name] = value;
            localStorage[name] = JSON.stringify(value);
        }
    };

    options.init = mergeFuns(options.init, function() {
        options.global.loadAll();
    });
})();
