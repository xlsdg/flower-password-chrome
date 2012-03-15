(function(options, messages) {
    function sendEnabled() {
        messages.extension.send('setLocalEnabled', {value: options.isEnabled()});
    }

    $.extend(options.global, {
        setCache: function(value) {
            if (!isUndefined(value)) {
                options.global.cache = value;
                options.onReady.fireEventOnce();
                sendEnabled();
            }
        },
        loadAll: function() {
            messages.extension.send('getGlobalOptions');
        },
        set: function(name, value) {
            options.global.cache[name] = value;
            messages.extension.send('setGlobalOption',{ name: name, value: value});
        }
    });

    $.extend(options, {
        onReady: new OnEvent(),

        isTransparent: function() {
            return options.global.cache.transparent;
        },

        onSetEnabled: new OnEvent(),
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
        setEnabled: function(value) {
            options.local.set('enabled', value);
            options.onSetEnabled.fireEvent();
        },
        toggleEnabled: function() {
            options.setEnabled(!options.isEnabled());
        }
    });

    $.extend(messages.extension.handles, {
        toggleLocalEnabled: function() {
            options.toggleEnabled();
            messages.extension.send('setLocalEnabled', {value: options.isEnabled()});
        },
        getLocalEnabled: function() {
            messages.extension.send('setLocalEnabled', {value: options.isEnabled()});
        },
        setGlobalOptions: function(data) {
            options.global.setCache(data.value);
        }
    });
    $.extend(messages.page.handles, {
        getLocalOptions: function() {
            messages.page.send('setLocalOptions', {value: options.local.cache});
        },
        setLocalOption: function(data) {
            options.local.set(data.name, data.value);
        }
    });
})(options, messages);
