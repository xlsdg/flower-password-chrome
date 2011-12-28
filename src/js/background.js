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
    options[name] = value;
    localStorage[name] = JSON.stringify(value);
}

function showAllPageActions() {
    chrome.windows.getAll({ populate: true }, function(windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            if (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    var tab = tabs[j];
                    chrome.pageAction.hide(tab.id);
                    chrome.tabs.sendRequest(tab.id, {action: 'requestEnabled'});
                }
            }
        }
    });
}

function setPageEnabled(tab, value) {
    var icon;
    var title;
    if (value) {
        icon = 'img/enabled.png';
        title = '在本网站停用花密';
    } else {
        icon = 'img/disabled.png';
        title = '在本网站启用花密';
    }
    chrome.pageAction.show(tab.id);
    chrome.pageAction.setIcon({tabId: tab.id, path: icon});
    chrome.pageAction.setTitle({tabId: tab.id, title: title});
}

function attachListeners() {
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.action == 'getOptions') {
            sendResponse(options);
        } else if (request.action == 'setOption') {
            setOption(request.name, request.value);
        } else if (request.action == 'setPageEnabled') {
            setPageEnabled(sender.tab, request.value);
        }
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (tab.status == 'loading') {
            chrome.pageAction.hide(tab.id);
        }
    });
    chrome.pageAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendRequest(tab.id, {action: 'toggleEnabled'});
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
