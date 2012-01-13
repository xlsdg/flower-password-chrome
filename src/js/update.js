$('#open-chrome-extensions').click(function() {
    chrome.tabs.create({url: 'chrome://extensions'});
});