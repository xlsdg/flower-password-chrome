var globalOptions = {};

function initOptions(callback) {
    chrome.extension.sendRequest({action: 'getOptions'}, function(response) {
        globalOptions = response;
        callback();
    });
}

function isFillKeyWithDomain() {
    return globalOptions.fillKeyWithDomain;
}

function setFillKeyWithDomain(value) {
    globalOptions.fillKeyWithDomain = value;
    chrome.extension.sendRequest({action: 'setOption', name: 'fillKeyWithDomain', value: value});
}
