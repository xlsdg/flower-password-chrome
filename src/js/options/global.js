(function(options) {
    var cache = {
        checkPasswordStrength: true,
        transparent: false,
        copyToClipboard: false,
        saveLastKey: true,
        fillKeyWithDomain: true,
        defaultEnabled: true,
        defaultAppendScramble: false,
        scramble: ''
    };

    options.global = {
        cache: cache,

        loadAll: function() {
            for (var name in cache) {
                var value = localStorage.getItem(name);
                if (value === null) {
                    options.global.set(name, cache[name]);
                } else {
                    cache[name] = JSON.parse(value);
                }
            }
        },
        set: function(name, value) {
            cache[name] = value;
            try {
                localStorage.setItem(name, JSON.stringify(value));
            } catch (e) {
                if (e.name === 'QUOTA_EXCEEDED_ERR') {
                    console.log(e);
                    options.writeLocalStorageFailed = true;
                }
            }
        }
    };

    options.onInit.addListener(function() {
        options.global.loadAll();
    });
})(options);
