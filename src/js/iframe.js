$.fn.hideWithNotify = function() {
    if (this.is(':visible')) {
        this.hide();
        adjustIframeSize();
    }
};

$.fn.showWithNotify = function() {
    if (!this.is(':visible')) {
        this.show();
        adjustIframeSize();
    }
};

var domain = '';
function getDefaultKey() {
    var value = domain;
    if (options.isAppendScramble()) {
        value += options.getScramble();
    }
    return value;
}

function fillKey(reset) {
    $("#key").removeClass('last default');
    $('#key').parents('.control-group').removeClass('warning');
    $("#no-maxlength").hideWithNotify();
    if (options.hasLastKey()) {
        var value = options.getLastKey();
        $("#key").valLimited(value).change().addClass('last');

        if (options.isFillKeyWithDomain()) {
            var defaultKey = getDefaultKey();
            if (value.length == 15 && defaultKey.length > 15 && defaultKey.indexOf(value) == 0) {
                $('#key').parents('.control-group').addClass('warning');
                $("#no-maxlength").showWithNotify();
            }
        }

    } else if (options.isFillKeyWithDomain()) {
        var value = getDefaultKey();
        $("#key").valLimited(value).change().addClass('default');
    } else if (reset) {
        $("#key").val('');
    }
}

function fillDefaultKey() {
    options.removeLastKey();
    fillKey();
}

function adjustIframeSize(locate) {
    var width = $('#main').outerWidth();
    var height = $('#main').outerHeight();
    messages.page.sendToTop('setIframeSize', {width: width, height: height, locate: locate});
}

function setupScrambleField() {
    if (options.isAppendScramble() && options.getScramble() == '') {
        $('#scramble').val(options.getScramble());
        $('#scramble-field').showWithNotify();
    } else {
        $('#scramble-field').hideWithNotify();
    }
};

options.onReady.addListener(function() {
    if (options.isTransparent()) {
        $('#main').focusin(function() {
            messages.page.sendToTop('focusinIframe');
        }).focusout(function() {
            messages.page.sendToTop('focusoutIframe');
        });
    }

    $('#close').click(function() {
        messages.page.sendToTop('closeIframe');
    });

    var mousedownOffset = null;
    function moveIframe(e) {
        messages.page.sendToTop('moveIframe', {dx: e.pageX - mousedownOffset.x, dy: e.pageY - mousedownOffset.y});
    }
    $('#title').mousedown(function(e) {
        if (e.button == 0) {
            mousedownOffset = {x: e.pageX, y: e.pageY};
            e.preventDefault();
        }
    });
    $(document).on('mouseup', function(e) {
        if (mousedownOffset) {
            moveIframe(e);
            mousedownOffset = null;
            e.preventDefault();
        }
    })
    .on('mousemove', function(e) {
        if (mousedownOffset) {
            moveIframe(e);
            e.preventDefault();
        }
    });

    $('#password, #key').change(function() {
        var password = $("#password").val();
        var key = $("#key").val();
        var result = flowerPassword.encrypt(password, key);
        if (result) {
            messages.page.broadcast('setCurrentFieldValue', {value: result[0]});
        }
    }).keyup(function(e) {
        if (e.matchKey(13) || e.matchKey(27)) {
            messages.page.sendToTop('closeIframe', {focusCurrentField: true});
        } else {
            $(this).change();
        }
    });

    var oldKey = null;
    $('#key').change(function() {
        var e = $(this);
        var value = e.val();
        if (value) {
            options.setLastKey(value);
        }
        if (oldKey != value) {
            e.removeClass('last default');
            e.parents('.control-group').removeClass('warning');
            $("#no-maxlength").hideWithNotify();
            oldKey = value;
        }
    });

    $('#fill-default-key').click(function() {
        fillDefaultKey();
    });

    $('#fill-key').prop("checked", options.isFillKeyWithDomain()).change(function() {
        options.setFillKeyWithDomain(this.checked);
        fillDefaultKey();
    });

    $('#append-scramble').change(function(e) {
        options.setAppendScramble(this.checked);
        fillDefaultKey();
        setupScrambleField();
    });

    var onScrambleChange = function() {
        options.setScramble(this.value);
        fillDefaultKey();
    };
    $('#scramble').change(onScrambleChange).keyup(onScrambleChange);

    $(document).on('click', '.alert .close', function() {
        $(this).parent().hideWithNotify();
    });

    messages.page.sendToTop('iframeReady');
});

$.extend(messages.page.handlers, {
    setupIframe: function(data) {
        options.local.cache = data.options;
        domain = data.domain;

        $('#append-scramble').prop("checked", options.isAppendScramble());
        setupScrambleField();

        $('#password').val('');
        fillKey(true);
    },
    focusPassword: function() {
        $('#password').focus();
    }
});

$(window).ready(function() {
    options.init();
}).load(function() {
    adjustIframeSize(true);
});
