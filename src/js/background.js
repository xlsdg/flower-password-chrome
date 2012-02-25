function forEachTab(callback) {
    chrome.windows.getAll({ populate: true }, function(windows) {
        for (var i = 0; i < windows.length; i++) {
            var tabs = windows[i].tabs;
            if (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    var tab = tabs[j];
                    callback(tab);
                }
            }
        }
    });
}

function showAllPageActions() {
    forEachTab(function(tab) {
        updatePageAction(tab);
    });
}

function updatePageAction(tab) {
    chrome.pageAction.hide(tab.id);
    chrome.tabs.sendRequest(tab.id, {action: 'getLocalEnabled'}, setPageEnabled(tab));
}

function notifyOptionsChanged() {
    forEachTab(function(tab) {
        chrome.pageAction.hide(tab.id);
        chrome.tabs.sendRequest(tab.id, {action: 'setGlobalOptions', value: options.global.cache});
    });
}

function setPageEnabled(tab, value) {
    if (isUndefined(value)) {
        return function(v) {
            if (!isUndefined(v)) {
                setPageEnabled(tab, v);
            }
        }
    }

    var icon;
    var title;
    if (value) {
        icon = 'img/enabled.png';
        title = '单击后将在本网站停用花密';
    } else {
        icon = 'img/disabled.png';
        title = '单击后将在本网站启用花密';
    }
    chrome.pageAction.setIcon({tabId: tab.id, path: icon});
    chrome.pageAction.setTitle({tabId: tab.id, title: title});
    chrome.pageAction.show(tab.id);
}

function attachListeners() {
    messages.extension.handles = $.extend(messages.extension.handles, {
        getGlobalOptions: function() {
            return options.global.cache;
        },
        setGlobalOption: function(data) {
            options.global.set(data.name, data.value);
            if (data.name == 'defaultEnabled') {
                notifyOptionsChanged();
            }
        },
        setLocalEnabled: function(data, sender) {
            setPageEnabled(sender.tab, data.value);
        }
    });
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.transit) {
            chrome.tabs.sendRequest(sender.tab.id, request, function(response) {
                sendResponse(response);
            });
        }
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (tab.status == 'loading') {
            updatePageAction(tab);
        }
    });
    chrome.pageAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendRequest(tab.id, {action: 'toggleLocalEnabled'}, setPageEnabled(tab));
    });
}

function init() {
    options.init();
    attachListeners();
    showAllPageActions();
}

init();
