$('#open-chrome-extensions').click(function() {
    chrome.extension.sendRequest({action: 'openChromeExtensions'});
});