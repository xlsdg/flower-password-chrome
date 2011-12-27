function setOptions(value) {
    options = value;
    localStorage.options = JSON.stringify(options);
}

var options = localStorage.options;
if (!options) {
    setOptions({fillKeyWithDomain: true});
} else {
    options = JSON.parse(options);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == 'getOptions') {
        sendResponse(options);
    } else if (request.action == 'setOptions') {
        setOptions(request.options);
    }
});
