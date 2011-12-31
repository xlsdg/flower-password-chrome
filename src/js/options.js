chrome.extension.sendRequest({action: 'getOptions'}, function(response) {
    var options = response;
    $('#flower-password-default-enabled').prop("checked", options.defaultEnabled).change(function() {
        chrome.extension.sendRequest({action: 'setOption', name: 'defaultEnabled', value: this.checked});
    });
    $('#flower-password-fill-key').prop("checked", options.fillKeyWithDomain).change(function() {
        chrome.extension.sendRequest({action: 'setOption', name: 'fillKeyWithDomain', value: this.checked});
    });
    $('#flower-password-append-scramble').prop("checked", options.defaultAppendScramble).change(function() {
        chrome.extension.sendRequest({action: 'setOption', name: 'defaultAppendScramble', value: this.checked});
    });

    var onScrambleChange = function() {
        chrome.extension.sendRequest({action: 'setOption', name: 'scramble', value: this.value});
    };
    $('#flower-password-scramble').val(options.scramble).change(onScrambleChange).keyup(onScrambleChange);
});
