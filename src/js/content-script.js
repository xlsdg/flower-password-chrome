function fillKey(reset) {
    $("#flower-password-key").removeClass('flower-password-last flower-password-default');
    if (options.hasLastKey()) {
        var value = options.getLastKey();
        $("#flower-password-key").valLimited(value).change().addClass('flower-password-last');
    } else if (options.isFillKeyWithDomain()) {
        var value = $.getDomain();
        if (options.isAppendScramble()) {
            value += options.getScramble();
        }
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

        function locateDialog() {
            var offset = currentField.offset();
            var height = currentField.outerHeight();
            $('#flower-password-input').css({left: offset.left + "px", top: offset.top + height + "px"});
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
        });
        $(document).on('focusin.fp', function(e) {
            if ($(e.target).is('input:password') || insideDialog($(e.target))) {
                return;
            }
            $('#flower-password-input').hide();
        });
        $(document).on('mousedown.fp', function(e) {
            if ($(e.target).is('input:password') || insideBounds(e, $('#flower-password-input'))) {
                return;
            }
            $('#flower-password-input').hide();
        });
        $(document).on('keydown.fp', function(e) {
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
            '<h1>花密 Flower Password <a href="http://kisexu.com/huami/" target="_blank"><img src="' + getURL('img/goto.png') + '" title="打开花密官网" /></a></h1>' +
            '<div class="flower-password-field"><label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value="" maxlength="20" accesskey="S" /></div>' +
            '<div class="flower-password-field"><label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value="" maxlength="15" /></div>' +
            '<div class="flower-password-field"><input id="flower-password-fill-key" name="flower-password-fill-key" type="checkbox" /><label for="flower-password-fill-key">默认将网站域名填入区分代号</label></div>' +
            '<div class="flower-password-field"><input id="flower-password-append-scramble" name="flower-password-append-scramble" type="checkbox" /><label for="flower-password-append-scramble">在默认区分代号后加上附加扰码</label></div>' +
            '<div class="flower-password-field" id="flower-password-scramble-field" style="display: none;"><label for="flower-password-scramble">附加扰码</label><input id="flower-password-scramble" name="flower-password-scramble" type="text" value="" maxlength="15" /></div>' +
            '<div id="flower-password-toolbar"><a href="' + getURL('options.html') + '" target="_blank"><img src="' + getURL('img/options.png') + '" /> 设置</a><a id="flower-password-hint-control"><img src="' + getURL('img/shrink.png') + '" /> 收起</a></div>' +
            '<ul id="flower-password-hint">' +
                '<li>记忆密码：可选择一个简单易记的密码，用于生成其他高强度密码。</li>' +
                '<li>区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。</li>' +
                '<li>附加扰码：添加到默认填入的区分代号后面，用于提高默认区分代号的强度，应选取一个有别于所有密码的值。</li>' +
                '<li>快捷键：Alt+S聚焦到记忆密码输入框；在页面任意地方按Alt+W，或者在上面两输入框中按Enter或Esc将关闭本窗口。</li>' +
            '</ul>' +
        '</div>'
    );
    $('head').append(
        '<style type="text/css">' +
            '#flower-password-input input[type="checkbox"]:checked::after { content: url(' + getURL('img/checkmark.png') + '); }' +
        '</style>'
    );

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
            oldKey = value;
        }
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
