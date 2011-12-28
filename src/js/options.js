var globalOptions = {};
var localOptions = {
    enabled: undefined
};
var onSetEnabled = null;

function setStorage(name, value) {
    localStorage['flower-password-' + name] = JSON.stringify(value);
}

function getStorage(name) {
    var value = localStorage['flower-password-' + name];
    if (typeof value != 'undefined') value = JSON.parse(value);
    return value;
}

function setOption(name, value) {
    localOptions[name] = value;
    setStorage(name, value);
}

function readOptions() {
    for (var name in localOptions) {
        var value = getStorage(name);
        if (typeof value == 'undefined') {
            if (typeof localOptions[name] != 'undefined') {
                setStorage(name, localOptions[name]);
            }
        } else {
            localOptions[name] = value;
        }
    }
}

function initOptions(callback) {
    readOptions();
    sendEnabled();
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

function isShowHint() {
    return globalOptions.showHint;
}

function setShowHint(value) {
    globalOptions.showHint = value;
    chrome.extension.sendRequest({action: 'setOption', name: 'showHint', value: value});
}

function isEnabled() {
    if (typeof localOptions.enabled == 'undefined') {
        return true;
    } else {
        return localOptions.enabled;
    }
}

function setEnabled(value) {
    setOption('enabled', value);
    if (onSetEnabled) onSetEnabled();
}

function toggleEnabled() {
    setEnabled(!isEnabled());
    sendEnabled();
}

function sendEnabled() {
    chrome.extension.sendRequest({action: 'setPageEnabled', value: isEnabled()});
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == 'toggleEnabled') {
        toggleEnabled();
    } else if (request.action = 'requestEnabled') {
        sendEnabled();
    }
});
