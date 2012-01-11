chrome.extension.sendRequest({action: 'getOptions'}, function(response) {
    var options = response;

    function setOption(name, value) {
        chrome.extension.sendRequest({action: 'setOption', name: name, value: value});
    }

    $('#flower-password-default-enabled').prop("checked", options.defaultEnabled).change(function() {
        setOption('defaultEnabled', this.checked);
    });
    $('#flower-password-transparent').prop("checked", options.transparent).change(function() {
        setOption('transparent', this.checked);
    });
    $('#flower-password-last-key').prop("checked", options.saveLastKey).change(function() {
        setOption('saveLastKey', this.checked);
    });
    $('#flower-password-fill-key').prop("checked", options.fillKeyWithDomain).change(function() {
        setOption('fillKeyWithDomain', this.checked);
    });
    $('#flower-password-append-scramble').prop("checked", options.defaultAppendScramble).change(function() {
        setOption('defaultAppendScramble', this.checked);
    });

    var onScrambleChange = function() {
        setOption('scramble', this.value);
    };
    $('#flower-password-scramble').val(options.scramble).change(onScrambleChange).keyup(onScrambleChange);
});
