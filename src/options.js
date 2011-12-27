var options = {};

function initOptions(callback) {
    chrome.extension.sendRequest({action: 'getOptions'}, function(response) {
        options = response;
        callback();
    });
}

function isFillKeyWithDomain() {
    return options.fillKeyWithDomain;
}

function setFillKeyWithDomain(value) {
    options.fillKeyWithDomain = value;
    chrome.extension.sendRequest({action: 'setOptions', options: options});
}
