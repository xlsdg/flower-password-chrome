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
    $("#key").removeClass('last default');
    $('#key').parents('.control-group').removeClass('warning');
    $("#no-maxlength").hideWithHash();
    if (options.hasLastKey()) {
        var value = options.getLastKey();
        $("#key").valLimited(value).change().addClass('last');

        if (options.isFillKeyWithDomain()) {
            var defaultKey = getDefaultKey();
            if (value.length == 15 && defaultKey.length > 15 && defaultKey.indexOf(value) == 0) {
                $('#key').parents('.control-group').addClass('warning');
                $("#no-maxlength").showWithHash();
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

function adjustIframeSize(first) {
    var width = $('#main').outerWidth();
    var height = $('#main').outerHeight();
    messages.page.send('setIframeSize', {width: width, height: height, first: first});
}

options.ready = function() {
    if (options.isTransparent()) {
        $('#main').focusin(function() {
            messages.page.send('focusinIframe');
        }).focusout(function() {
            messages.page.send('focusoutIframe');
        });
    }

    $('#close').click(function() {
        messages.page.send('closeIframe');
    });

    var mousedownOffset = null;
    function moveIframe(e) {
        messages.page.send('moveIframe', {dx: e.pageX - mousedownOffset.x, dy: e.pageY - mousedownOffset.y});
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
    $('#key').change(function() {
        var e = $(this);
        var value = e.val();
        if (value) {
            options.setLastKey(value);
        }
        if (oldKey != value) {
            e.removeClass('last default');
            e.parents('.control-group').removeClass('warning');
            $("#no-maxlength").hideWithHash();
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

    var setupScrambleField = function() {
        if (options.isAppendScramble() && options.getScramble() == '') {
            $('#scramble').val(options.getScramble());
            $('#scramble-field').showWithHash();
        } else {
            $('#scramble-field').hideWithHash();
        }
    };
    $('#append-scramble').prop("checked", options.isAppendScramble()).change(function(e) {
        options.setAppendScramble(this.checked);
        fillDefaultKey();
        setupScrambleField();
    });
    setupScrambleField();

    var onScrambleChange = function() {
        options.setScramble(this.value);
        fillDefaultKey();
    };
    $('#scramble').change(onScrambleChange).keyup(onScrambleChange);

    var setupHint = function() {
        $('#hint-shrink, #hint-expand').hide();
        if (options.isShowHint()) {
            $('#hint').showWithHash();
            $('#hint-shrink').show();
        } else {
            $('#hint').hideWithHash();
            $('#hint-expand').show();
        }
    }
    $('#hint-expand').click(function() {
        options.setShowHint(true);
        setupHint();
    });
    $('#hint-shrink').click(function() {
        options.setShowHint(false);
        setupHint();
    });
    setupHint();

    $(document).on('click', '.alert .close', function() {
        $(this).parent().hideWithHash();
    });

    adjustIframeSize(true);
    messages.page.send('iframeReady');
};

messages.page.handles = $.extend(messages.page.handles, {
    setupPasswordAndKey: function(data) {
        domain = data.domain;
        $('#password').val('');
        fillKey(true);
    },
    focusPassword: function() {
        $('#password').focus();
    }
});

$(window).load(function() {
    options.init();
}).on('hashchange', function() {
    adjustIframeSize();
});
