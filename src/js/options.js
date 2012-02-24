$(function() {
    options.init();

    options.global.set = mergeFuns(options.global.set, function(name, value) {
        chrome.extension.sendRequest({action: 'setGlobalOption', name: name, value: value});
    });

    $('#flower-password-default-enabled').prop("checked", options.global.cache.defaultEnabled).change(function() {
        options.global.set('defaultEnabled', this.checked);
        chrome.extension.sendRequest({action: 'globalOptionsChanged'});
    });
    $('#flower-password-transparent').prop("checked", options.global.cache.transparent).change(function() {
        options.global.set('transparent', this.checked);
    });
    $('#flower-password-last-key').prop("checked", options.global.cache.saveLastKey).change(function() {
        options.global.set('saveLastKey', this.checked);
    });
    $('#flower-password-fill-key').prop("checked", options.global.cache.fillKeyWithDomain).change(function() {
        options.global.set('fillKeyWithDomain', this.checked);
    });
    $('#flower-password-append-scramble').prop("checked", options.global.cache.defaultAppendScramble).change(function() {
        options.global.set('defaultAppendScramble', this.checked);
    });
    $('#flower-password-scramble').val(options.global.cache.scramble).change(function() {
        options.global.set('scramble', this.value);
    }).keyup(function() {
        $(this).change();
    });
});
