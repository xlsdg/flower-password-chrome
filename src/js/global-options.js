chrome.extension.sendRequest({action: 'getOptions'}, function(response) {
    var options = response;
    $('#flower-password-default-enabled').prop("checked", options.defaultEnabled).change(function() {
        chrome.extension.sendRequest({action: 'setDefaultEnabled', value: this.checked});
    });
    $('#flower-password-fill-key').prop("checked", options.fillKeyWithDomain).change(function() {
        chrome.extension.sendRequest({action: 'setOption', name: 'fillKeyWithDomain', value: this.checked});
    });
});
