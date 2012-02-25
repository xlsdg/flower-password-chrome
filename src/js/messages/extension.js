var messages = messages || {};

(function() {
    messages.extension = {
        send: function(action, data, callback) {
            if (callback) {
                chrome.extension.sendRequest($.extend({action: action}, data), callback);
            } else {
                chrome.extension.sendRequest($.extend({action: action}, data));
            }
        },
        handles: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var handle = messages.extension.handles[request.action];
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
