var messages = messages || {};

(function() {
    messages.page = {
        send: function(action, data) {
            chrome.extension.sendRequest($.extend({action: action, transit: true}, data));
        },
        handlers: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var handle = messages.page.handlers[request.action];
        if (handle) {
            handle(request, sender);
            sendResponse({});
        }
    });
})();
