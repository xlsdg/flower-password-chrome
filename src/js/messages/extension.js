var messages = messages || {};

(function() {
    messages.extension = {
        send: function(action, data) {
            chrome.extension.sendRequest($.extend({action: action}, data));
        },
        handles: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var handle = messages.extension.handles[request.action];
        if (handle) {
            handle(request, sender);
            sendResponse({});
        }
    });
})();
