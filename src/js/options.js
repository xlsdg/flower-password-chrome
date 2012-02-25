$(function() {
    options.init();

    options.global.set = mergeFuns(options.global.set, function(name, value) {
        chrome.extension.sendRequest({action: 'setGlobalOption', name: name, value: value});
    });

    $('#default-enabled').prop("checked", options.global.cache.defaultEnabled).change(function() {
        options.global.set('defaultEnabled', this.checked);
    });
    $('#transparent').prop("checked", options.global.cache.transparent).change(function() {
        options.global.set('transparent', this.checked);
    });
    $('#last-key').prop("checked", options.global.cache.saveLastKey).change(function() {
        options.global.set('saveLastKey', this.checked);
    });
    $('#fill-key').prop("checked", options.global.cache.fillKeyWithDomain).change(function() {
        options.global.set('fillKeyWithDomain', this.checked);
    });
    $('#append-scramble').prop("checked", options.global.cache.defaultAppendScramble).change(function() {
        options.global.set('defaultAppendScramble', this.checked);
    });
    $('#scramble').val(options.global.cache.scramble).change(function() {
        options.global.set('scramble', this.value);
    }).keyup(function() {
        $(this).change();
    });
});
