var messages = messages || {};

(function() {
    var id = new Date().getTime() % 1000000 + Math.random();

    messages.page = {
        send: function(action, data) {
            chrome.extension.sendRequest($.extend({action: action, transit: true, from: id}, data));
        },
        handlers: {}
    };

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (!request.transit) {
            return;
        }
        if (!isUndefined(request.to) && request.to !== id) {
            return;
        }
        var handle = messages.page.handlers[request.action];
        if (handle) {
            handle(request, sender);
            sendResponse({});
        }
    });

    messages.all = {
        send: function(action, data) {
            messages.extension.send(action, data);
            messages.page.send(action, data);
        }
    };
})();
