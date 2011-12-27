function readOptions() {
    for (var name in options) {
        if (typeof localStorage[name] == 'undefined') {
            setOption(name, options[name]);
        } else {
            options[name] = JSON.parse(localStorage[name]);
        }
    }
}

function setOption(name, value) {
    console.log(name + ":" + value);
    options[name] = value;
    localStorage[name] = JSON.stringify(value);
}

function showPageAction(tab) {
    var url = tab.url;
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
        chrome.pageAction.show(tab.id);
    } else {
        chrome.pageAction.hide(tab.id);
    }
}

function showAllPageActions() {
    chrome.windows.getAll({ populate: true }, function(windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            if (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    showPageAction(tabs[j]);
                }
            }
        }
    });
}

function attachListeners() {
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.action == 'getOptions') {
            sendResponse(options);
        } else if (request.action == 'setOption') {
            setOption(request.name, request.value);
        }
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        showPageAction(tab);
    });
}

function init() {
    readOptions();
    attachListeners();
    showAllPageActions();
}

var options = {
    fillKeyWithDomain: true
};

init();
