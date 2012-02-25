var dialogOffset = null;

function calculateDialogOffset() {
    var offset = currentField.offset();
    var width = currentField.outerWidth();
    var result;
    if (offset.left - $(document).scrollLeft() + width + $('#flower-password-iframe').outerWidth() <= $(window).width()) {
        result = {left: offset.left + width, top: offset.top};
    } else {
        var height = currentField.outerHeight();
        result = {left: offset.left, top: offset.top + height};
    }
    return result;
}

function moveDialog(delta) {
    locateDialog({left: dialogOffset.left + delta.dx, top: dialogOffset.top + delta.dy});
}

function locateDialog(offset) {
    if (!offset) {
        offset = calculateDialogOffset();
    }
    $('#flower-password-iframe').css({left: offset.left + "px", top: offset.top + "px"});
    dialogOffset = offset;
}

var currentField = null;

function setupInputListeners() {
    if (options.isEnabled()) {
        $(document).on('focus.fp', 'input:password', function() {
            lazyInject();
            if (!currentField || currentField.get(0) != this) {
                messages.page.send('setupPasswordAndKey', {});
            }
            currentField = $(this);
            locateDialog();
            $('#flower-password-iframe').show();
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
                messages.page.send('focusPassword', {});
            }
        });
        $(window).on('resize.fp', function() {
            if ($('#flower-password-iframe').is(':visible')) {
                locateDialog();
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

    options.setDomain($.getDomain());

    $('body').append('<iframe id="flower-password-iframe" src="' + chrome.extension.getURL('iframe.html') + '" style="display: none;"></iframe>');
    if (options.isTransparent()) {
        $('#flower-password-iframe').addClass('transparent');
    }
}

messages.page.handles = $.extend(messages.page.handles, {
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
    moveIframe: moveDialog
});

options.onSetEnabled = function() {
    setupInputListeners();
    if (!options.isEnabled()) {
        $('#flower-password-iframe').hide();
    }
};

options.init(); // options.init() will call options.onSetEnabled()
