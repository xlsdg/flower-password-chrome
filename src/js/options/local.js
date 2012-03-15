(function(options) {
    var cache = {
        enabled: undefined,
        appendScramble: undefined,
        lastKey: undefined
    };

    function saveStorage(name, value) {
        if (!isUndefined(value)) {
            localStorage['flower-password-' + name] = JSON.stringify(value);
        } else {
            delete localStorage['flower-password-' + name];
        }
    }

    function loadStorage(name) {
        var value = localStorage['flower-password-' + name];
        if (!isUndefined(value)) value = JSON.parse(value);
        return value;
    }

    options.local = {
        cache: cache,

        loadAll: function() {
            for (var name in cache) {
                var value = loadStorage(name);
                if (isUndefined(value)) {
                    if (!isUndefined(cache[name])) {
                        saveStorage(name, cache[name]);
                    }
                } else {
                    cache[name] = value;
                }
            }
        },
        set: function(name, value) {
            cache[name] = value;
            saveStorage(name, value);
        }
    };

    options.onInit.addListener(function() {
        options.local.loadAll();
    });
})(options);
