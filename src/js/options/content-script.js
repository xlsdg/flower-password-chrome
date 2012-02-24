(function(options) {
    function sendEnabled() {
        chrome.extension.sendRequest({action: 'setLocalEnabled', value: options.isEnabled()});
    }

    function triggerOnSetEnabled() {
        if (options.onSetEnabled) options.onSetEnabled();
    }

    $.extend(options.global, {
        setCache: function(value) {
            if (!isUndefined(value)) {
                options.global.cache = value;
                sendEnabled();
                triggerOnSetEnabled();
            }
        },
        loadAll: function() {
            chrome.extension.sendRequest({action: 'getGlobalOptions'}, options.global.setCache);
        },
        set: function(name, value) {
            options.global.cache[name] = value;
            chrome.extension.sendRequest({action: 'setGlobalOption', name: name, value: value});
        }
    });

    $.extend(options, {
        isTransparent: function() {
            return options.global.cache.transparent;
        },

        hasLastKey: function() {
            return options.global.cache.saveLastKey && !isUndefined(options.local.cache.lastKey);
        },
        getLastKey: function() {
            return options.local.cache.lastKey;
        },
        setLastKey: function(value) {
            if (options.global.cache.saveLastKey) {
                options.local.set('lastKey', value);
            } else {
                options.removeLastKey();
            }
        },
        removeLastKey: function() {
            options.local.set('lastKey', undefined);
        },

        isFillKeyWithDomain: function() {
            return options.global.cache.fillKeyWithDomain;
        },
        setFillKeyWithDomain: function(value) {
            options.global.set('fillKeyWithDomain', value);
        },

        isDefaultAppendScramble: function() {
            return options.global.cache.defaultAppendScramble;
        },
        isAppendScramble: function() {
            if (isUndefined(options.local.cache.appendScramble)) {
                return options.isDefaultAppendScramble();
            } else {
                return options.local.cache.appendScramble;
            }
        },
        setAppendScramble: function(value) {
            options.local.set('appendScramble', value);
        },

        getScramble: function() {
            return options.global.cache.scramble;
        },
        setScramble: function(value) {
            options.global.set('scramble', value);
        },

        isShowHint: function() {
            return options.global.cache.showHint;
        },
        setShowHint: function(value) {
            options.global.set('showHint', value);
        },
        toggleShowHint: function() {
            options.setShowHint(!options.isShowHint());
        },

        onSetEnabled: null,
        isDefaultEnabled: function() {
            return options.global.cache.defaultEnabled;
        },
        isEnabled: function() {
            if (isUndefined(options.local.cache.enabled)) {
                return options.isDefaultEnabled();
            } else {
                return options.local.cache.enabled;
            }
        },
        setEnabled: function (value) {
            options.local.set('enabled', value);
            triggerOnSetEnabled();
        },
        toggleEnabled: function() {
            options.setEnabled(!options.isEnabled());
        }
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.action == 'toggleLocalEnabled') {
            options.toggleEnabled();
            sendResponse(options.isEnabled());
        } else if (request.action == 'getLocalEnabled') {
            sendResponse(options.isEnabled());
        } else if (request.action == 'setGlobalOptions') {
            options.global.setCache(request.value);
        }
    });
})(options);
