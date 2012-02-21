function getDefaultKey() {
    var value = $.getDomain();
    if (options.isAppendScramble()) {
        value += options.getScramble();
    }
    return value;
}

function fillKey(reset) {
    $("#flower-password-key").removeClass('flower-password-last flower-password-default');
    $("#flower-password-no-maxlength").hide();
    if (options.hasLastKey()) {
        var value = options.getLastKey();
        $("#flower-password-key").valLimited(value).change().addClass('flower-password-last');

        if (options.isFillKeyWithDomain()) {
            var defaultKey = getDefaultKey();
            if (value.length == 15 && defaultKey.length > 15 && defaultKey.indexOf(value) == 0) {
                $("#flower-password-no-maxlength").show();
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

var currentField = null;
var dialogOffset = null;
var mousedownOffset = null;
function setupInputListeners() {
    if (options.isEnabled()) {

        function insideDialog(e) {
            return e.parents('#flower-password-input').size() > 0;
        }

        function getBounds(e) {
            var offset = e.offset();
            var width = e.outerWidth();
            var height = e.outerHeight();
            return $.extend({right: offset.left + width, bottom: offset.top + height}, offset);
        }

        function insideBounds(e, t) {
            var b = getBounds(t);
            return e.pageX >= b.left && e.pageX < b.right && e.pageY >= b.top && e.pageY < b.bottom;
        }

        function calculateDialogOffset() {
            var offset = currentField.offset();
            var width = currentField.outerWidth();
            if (offset.left - $(document).scrollLeft() + width + $('#flower-password-input').outerWidth() <= $(window).width()) {
                dialogOffset = {left: offset.left + width, top: offset.top};
            } else {
                var height = currentField.outerHeight();
                dialogOffset = {left: offset.left, top: offset.top + height};
            }
            return dialogOffset;
        }

        function moveDialogOffset(e) {
            return {
                left: dialogOffset.left + (e.pageX - mousedownOffset.x),
                top: dialogOffset.top + (e.pageY - mousedownOffset.y)
            };
        }

        function locateDialog(offset) {
            if (!offset) {
                offset = calculateDialogOffset();
            }
            $('#flower-password-input').css({left: offset.left + "px", top: offset.top + "px"});
        }

        $(document).on('focus.fp', 'input:password', function() {
            if (insideDialog($(this))) {
                return;
            }
            lazyInject();
            if (!currentField || currentField.get(0) != this) {
                $('#flower-password-password').val('');
                fillKey(true);
            }
            currentField = $(this);
            locateDialog();
            $('#flower-password-input').show();
        })
        .on('focusin.fp', function(e) {
            if ($(e.target).is('input:password') || insideDialog($(e.target))) {
                return;
            }
            $('#flower-password-input').hide();
        })
        .on('mousedown.fp', function(e) {
            if (!$('#flower-password-input').is(':visible') || $(e.target).is('input:password') || insideBounds(e, $('#flower-password-input'))) {
                return;
            }
            $('#flower-password-input').hide();
        })
        .on('mousedown.fp', '#flower-password-title', function(e) {
            if (e.button == 0) {
                mousedownOffset = {x: e.pageX, y: e.pageY};
                e.preventDefault();
            }
        })
        .on('mouseup.fp', function(e) {
            if (mousedownOffset) {
                dialogOffset = moveDialogOffset(e);
                locateDialog(dialogOffset);
                mousedownOffset = null;
                e.preventDefault();
            }
        })
        .on('mousemove.fp', function(e) {
            if (mousedownOffset) {
                locateDialog(moveDialogOffset(e));
                e.preventDefault();
            }
        })
        .on('keydown.fp', function(e) {
            if (e.matchKey(87, {alt: true})) {
                $('#flower-password-input').hide();
            }
        });
        $(window).on('resize.fp', function() {
            if ($('#flower-password-input').is(':visible')) {
                locateDialog();
            }
        });
    } else {
        $(document).off('.fp');
        $(window).off('.fp');
    }
}

function lazyInject() {
    function isInjected() {
        return $('#flower-password-input').size() > 0;
    }

    if (!options.isEnabled() || isInjected()) {
        return;
    }

    var getURL = chrome.extension.getURL;
    $('body').append(
        '<div id="flower-password-input" style="display: none;">' +
            '<span id="flower-password-close" title="关闭">关闭</span>' +
            '<h1><span id="flower-password-title">花密 Flower Password</span> <a href="http://flowerpassword.com/" target="_blank"><img src="' + getURL('img/goto.png') + '" title="打开花密官网" /></a></h1>' +
            '<div class="flower-password-field"><label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value="" accesskey="S" /></div>' +
            '<div class="flower-password-field"><label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value="" /></div>' +
            '<div id="flower-password-no-maxlength" style="display: none;"><span id="flower-password-no-maxlength-arrow"></span><div id="flower-password-no-maxlength-hint">' +
                '<p>　旧版花密限制了区分代号的最大长度为15，新版花密已去除此限制，这意味着你可以使用更长更安全的区分代号。</p>' +
                '<p>　然而，此区分代号是由旧版花密生成的默认区分代号，其长度被限制为15，而由新版生成的默认区分代号则会更长。</p>' +
                '<p>　一旦您清除了历史记录，新的默认区分代号将导致最终生成的密码发生变化，这将导致您无法登录当前网站！</p>' +
                '<p>　因此，我们强烈建议您使用新的默认区分代号修改您在当前网站的密码。请您在输入新密码的时候，<a id="flower-password-fill-default-key">点击这里生成新的默认区分代号</a>。</p>' +
            '</div></div>' +
            '<div class="flower-password-field" title="对所有网站有效"><input id="flower-password-fill-key" name="flower-password-fill-key" type="checkbox" /><label for="flower-password-fill-key">默认将网站域名填入区分代号</label></div>' +
            '<div class="flower-password-field" title="只对本网站有效"><input id="flower-password-append-scramble" name="flower-password-append-scramble" type="checkbox" /><label for="flower-password-append-scramble">在默认区分代号后加上附加扰码</label></div>' +
            '<div class="flower-password-field" id="flower-password-scramble-field" style="display: none;"><label for="flower-password-scramble">附加扰码</label><input id="flower-password-scramble" name="flower-password-scramble" type="text" value="" /></div>' +
            '<div id="flower-password-toolbar"><a href="' + getURL('options.html') + '" target="_blank"><img src="' + getURL('img/options.png') + '" /> 设置</a><a id="flower-password-hint-control"><img src="' + getURL('img/shrink.png') + '" /> 收起</a></div>' +
            '<ul id="flower-password-hint">' +
                '<li>记忆密码：选择一个与个人信息无关的密码，防止社会工程学破解。</li>' +
                '<li>区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。</li>' +
                '<li>附加扰码：添加到默认填入的区分代号后面，用于提高默认区分代号的强度。可适当加入分隔符，如“.abc”或“#abc”。</li>' +
                '<li>快捷键：Alt+S聚焦到记忆密码输入框；在页面任意地方按Alt+W，或者在上面两输入框中按Enter或Esc将关闭本窗口。</li>' +
            '</ul>' +
        '</div>'
    );
    $('head').append(
        '<style type="text/css">' +
            '#flower-password-input input[type="checkbox"]:checked::after { content: url(' + getURL('img/checkmark.png') + '); }' +
        '</style>'
    );

    if (options.isTransparent()) {
        $('#flower-password-input').addClass('transparent').focusin(function() {
            $(this).addClass('nontransparent');
        }).focusout(function() {
            $(this).removeClass('nontransparent');
        });
    }

    $('#flower-password-close').click(function() {
        $('#flower-password-input').hide();
    });

    $('#flower-password-password, #flower-password-key').change(function() {
        var password = $("#flower-password-password").val();
        var key = $("#flower-password-key").val();
        var result = flowerPassword.encrypt(password, key);
        if (result) {
            var code = result[0];
            currentField.valLimited(code);
        }
    }).keyup(function(e) {
        if (e.matchKey(13) || e.matchKey(27)) {
            currentField.focus();
            $('#flower-password-input').hide();
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
            $("#flower-password-no-maxlength").hide();
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
            $('#flower-password-scramble-field').show();
        } else {
            $('#flower-password-scramble-field').hide();
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
        if (options.isShowHint()) {
            $('#flower-password-hint-control').html('<img src="' + getURL('img/shrink.png') + '" /> 收起');
            $('#flower-password-hint').show();
        } else {
            $('#flower-password-hint-control').html('<img src="' + getURL('img/expand.png') + '" /> 提示');
            $('#flower-password-hint').hide();
        }
    }
    $('#flower-password-hint-control').click(function() {
        options.toggleShowHint();
        setupHint();
    });
    setupHint();
}

options.onSetEnabled = function() {
    setupInputListeners();
    if (!options.isEnabled()) {
        $('#flower-password-input').hide();
    }
};
options.init(); // options.init() will call options.onSetEnabled()
