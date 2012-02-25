var messages = messages || {};

(function() {
    messages.page = {
        send: function(action, data, callback) {
            if (callback) {
                chrome.extension.sendRequest($.extend({action: action, transit: true}, data), callback);
            } else {
                chrome.extension.sendRequest($.extend({action: action, transit: true}, data));
            }
        },
        handles: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var handle = messages.page.handles[request.action];
        if (handle) {
            var result = handle(request, sender);
            if (!isUndefined(result)) {
                sendResponse(result);
            } else {
                sendResponse({});
            }
        }
    });
})();
