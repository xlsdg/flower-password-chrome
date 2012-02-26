function getHashIds(jObject) {
    var a = jObject.toArray();
    $.each(a, function(i, e) {
        a[i] = e.id;
    });
    return a.join('&');
}

$.fn.hideWithHash = function() {
    this.hide();
    location.hash = '#!hide:' + getHashIds(this);
};

$.fn.showWithHash = function() {
    this.show();
    location.hash = '#!show:' + getHashIds(this);
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
    $("#flower-password-key").removeClass('flower-password-last flower-password-default');
    $("#flower-password-no-maxlength").hideWithHash();
    if (options.hasLastKey()) {
        var value = options.getLastKey();
        $("#flower-password-key").valLimited(value).change().addClass('flower-password-last');

        if (options.isFillKeyWithDomain()) {
            var defaultKey = getDefaultKey();
            if (value.length == 15 && defaultKey.length > 15 && defaultKey.indexOf(value) == 0) {
                $("#flower-password-no-maxlength").showWithHash();
            }
        }

    } else if (options.isFillKeyWithDomain()) {
        var value = getDefaultKey();
        $("#flower-password-key").valLimited(value).change().addClass('flower-password-default');
    } else if (reset) {
        $("#flower-password-key").val('');
    }
}

function fillDefaultKey() {
    options.removeLastKey();
    fillKey();
}

function adjustIframeSize(first) {
    var width = $('#flower-password-input').outerWidth();
    var height = $('#flower-password-input').outerHeight();
    messages.page.send('setIframeSize', {width: width, height: height, first: first});
}

options.ready = function() {
    if (options.isTransparent()) {
        $('#flower-password-input').focusin(function() {
            messages.page.send('focusinIframe');
        }).focusout(function() {
            messages.page.send('focusoutIframe');
        });
    }

    $('#flower-password-close').click(function() {
        messages.page.send('closeIframe');
    });

    var mousedownOffset = null;
    function moveIframe(e) {
        messages.page.send('moveIframe', {dx: e.pageX - mousedownOffset.x, dy: e.pageY - mousedownOffset.y});
    }
    $('#flower-password-title').mousedown(function(e) {
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

    $('#flower-password-password, #flower-password-key').change(function() {
        var password = $("#flower-password-password").val();
        var key = $("#flower-password-key").val();
        var result = flowerPassword.encrypt(password, key);
        if (result) {
            messages.page.send('setCurrentFieldValue', {value: result[0]});
        }
    }).keyup(function(e) {
        if (e.matchKey(13) || e.matchKey(27)) {
            messages.page.send('closeIframe', {focusCurrentField: true});
        } else {
            $(this).change();
        }
    });

    var oldKey = null;
    $('#flower-password-key').change(function() {
        var e = $(this);
        var value = e.val();
        if (value) {
            options.setLastKey(value);
        }
        if (oldKey != value) {
            e.removeClass('flower-password-last flower-password-default');
            $("#flower-password-no-maxlength").hideWithHash();
            oldKey = value;
        }
    });

    $('#flower-password-fill-default-key').click(function() {
        fillDefaultKey();
    });

    $('#flower-password-fill-key').prop("checked", options.isFillKeyWithDomain()).change(function() {
        options.setFillKeyWithDomain(this.checked);
        fillDefaultKey();
    });

    var setupScrambleField = function() {
        if (options.isAppendScramble() && options.getScramble() == '') {
            $('#flower-password-scramble').val(options.getScramble());
            $('#flower-password-scramble-field').showWithHash();
        } else {
            $('#flower-password-scramble-field').hideWithHash();
        }
    };
    $('#flower-password-append-scramble').prop("checked", options.isAppendScramble()).change(function(e) {
        options.setAppendScramble(this.checked);
        fillDefaultKey();
        setupScrambleField();
    });
    setupScrambleField();

    var onScrambleChange = function() {
        options.setScramble(this.value);
        fillDefaultKey();
    };
    $('#flower-password-scramble').change(onScrambleChange).keyup(onScrambleChange);

    var setupHint = function() {
        $('#flower-password-hint-shrink, #flower-password-hint-expand').hide();
        if (options.isShowHint()) {
            $('#flower-password-hint').showWithHash();
            $('#flower-password-hint-shrink').show();
        } else {
            $('#flower-password-hint').hideWithHash();
            $('#flower-password-hint-expand').show();
        }
    }
    $('#flower-password-hint-expand').click(function() {
        options.setShowHint(true);
        setupHint();
    });
    $('#flower-password-hint-shrink').click(function() {
        options.setShowHint(false);
        setupHint();
    });
    setupHint();

    adjustIframeSize(true);
    messages.page.send('iframeReady');
};

messages.page.handles = $.extend(messages.page.handles, {
    setupPasswordAndKey: function(data) {
        domain = data.domain;
        $('#flower-password-password').val('');
        fillKey(true);
    },
    focusPassword: function() {
        $('#flower-password-password').focus();
    }
});

$(window).load(function() {
    options.init();
}).on('hashchange', function() {
    adjustIframeSize();
});
