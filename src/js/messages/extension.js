var messages = messages || {};

(function() {
    messages.extension = {
        send: function(action, data) {
            chrome.extension.sendRequest($.extend({action: action}, data));
        },
        handlers: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.transit) {
            return;
        }
        var handle = messages.extension.handlers[request.action];
        if (handle) {
            handle(request, sender);
            sendResponse({});
        }
    });
})();
