var dialogOffset = null;
var currentField = null;
var current = {left: 0, top: 0, width: 0, height: 0};

function calculateDialogOffset() {
    var result;
    if (current.left - $(document).scrollLeft() + current.width + $('#flower-password-iframe').outerWidth() <= $(window).width()) {
        result = {left: current.left + current.width, top: current.top};
    } else {
        result = {left: current.left, top: current.top + current.height};
    }
    return result;
}

function locateDialog(offset) {
    if (!offset) {
        offset = calculateDialogOffset();
    }
    $('#flower-password-iframe').css({left: offset.left + "px", top: offset.top + "px"});
    dialogOffset = offset;
}

function setupInputListeners() {
    if (options.isEnabled()) {
        $(document).on('focus.fp', 'input:password', function() {
            if (!currentField || currentField.get(0) != this) {
                messages.page.send('setupPasswordAndKey', {domain: $.getDomain()});
            }
            currentField = $(this);

            var width = currentField.outerWidth();
            var height = currentField.outerHeight();
            if (isTopWindow()) {
                var offset = currentField.offset();
                current = {left: offset.left, top: offset.top, width: width, height: height};
                lazyInject();
                locateDialog();
                $('#flower-password-iframe').show();
            } else {
                var box = this.getBoundingClientRect();
                var data = {action: 'startMessage', message: 'showIframe', left: box.left, top: box.top, width: width, height: height};
                window.postMessage(data, '*');
            }
        })
        .on('focusin.fp mousedown.fp', function(e) {
            if (!$('#flower-password-iframe').is(':visible') || $(e.target).is('input:password')) {
                return;
            }
            $('#flower-password-iframe').hide();
        })
        .on('keydown.fp', function(e) {
            if (e.matchKey(87, {alt: true})) {
                $('#flower-password-iframe').hide();
            } else if (e.matchKey(83, {alt: true})) {
                messages.page.send('focusPassword');
            }
        });
        $(window).on('resize.fp', function() {
            if ($('#flower-password-iframe').is(':visible')) {
                locateDialog();
            }
        })
        .on('message.fp', function(e) {
            var data = e.originalEvent.data;
            if (typeof data === 'object' && data.action === 'receiveMessage' && data.message === 'showIframe') {
                current = {left: data.left, top: data.top, width: data.width, height: data.height};
                lazyInject();
                locateDialog();
                $('#flower-password-iframe').show();
            }
        });

        $('input:password:focus').focus();
    } else {
        $(document).off('.fp');
        $(window).off('.fp');
    }
}

function lazyInject() {
    if (!options.isEnabled() || $('#flower-password-iframe').size() > 0) {
        return;
    }

    $('body').append('<iframe id="flower-password-iframe" src="' + chrome.extension.getURL('iframe.html') + '" style="display: none;"></iframe>');
    if (options.isTransparent()) {
        $('#flower-password-iframe').addClass('transparent');
    }
}

$.extend(messages.page.handles, {
    iframeReady: function() {
        messages.page.send('setupPasswordAndKey', {domain: $.getDomain()});
    },
    setIframeSize: function(data) {
        $('#flower-password-iframe').width(data.width).height(data.height);
        if (data.first) locateDialog();
    },
    closeIframe: function(data) {
        if (data.focusCurrentField) currentField.focus();
        $('#flower-password-iframe').hide();
    },
    focusinIframe: function() {
        $('#flower-password-iframe').addClass('nontransparent');
    },
    focusoutIframe: function() {
        $('#flower-password-iframe').removeClass('nontransparent');
    },
    setCurrentFieldValue: function(data) {
        currentField.valLimited(data.value);
    },
    moveIframe: function(data) {
        locateDialog({left: dialogOffset.left + data.dx, top: dialogOffset.top + data.dy});
    }
});

options.onSetEnabled = function() {
    setupInputListeners();
    if (!options.isEnabled()) {
        $('#flower-password-iframe').hide();
    }
};

options.init(); // options.init() will call options.onSetEnabled()

function injectPageScript() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL('js/page.js'));
    document.head.appendChild(script);
}
injectPageScript();