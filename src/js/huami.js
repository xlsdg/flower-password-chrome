function countCode(password, key){
    if(password && key){
        var md5one = $.md5(password,key);
        var md5two = $.md5(md5one,'snow');
        var md5three = $.md5(md5one,'kise');
        //计算大小写
        var rule = md5three.split("");
        var source = md5two.split("");
        for(var i=0;i<=31;i++){ 
            if(isNaN(source[i])){
                var str ="sunlovesnow1990090127xykab";
                if(str.search(rule[i]) > -1){
                    source[i] = source[i].toUpperCase();
                }
            }
        }
        var code32 = source.join("");
        var code1 = code32.slice(0,1);
        if(isNaN(code1)){
            var code16 = code32.slice(0,16);
        }else{
            var code16 = "K" + code32.slice(1,16);
        }
        return [code16, code32];
    }
}

function matchKey(e, which, modifier) {
    var ctrl = (typeof modifier != 'undefined') && (modifier.ctrl == true);
    var alt = (typeof modifier != 'undefined') && (modifier.alt == true);
    var shift = (typeof modifier != 'undefined') && (modifier.shift == true);
    var meta = (typeof modifier != 'undefined') && (modifier.meta == true);
    return e.which == which && e.ctrlKey == ctrl && e.altKey == alt && e.shiftKey == shift && e.metaKey == meta;
}

function setInputValue(input, value) {
    var maxlength = parseInt(input.prop('maxlength'));
    if (maxlength < value.length) {
        value = value.slice(0, maxlength);
    }
    input.val(value);
}

function fillKey(reset) {
    if (isFillKeyWithDomain()) {
        var value = getDomain(window.location.hostname);
        if (isAppendScramble()) {
            value += getScramble();
        }
        setInputValue($("#flower-password-key"), value);
    } else if (reset) {
        $("#flower-password-key").val('');
    }
}

var currentField = null;
function setupInputListeners() {
    if (isEnabled()) {
        function insideBox(e) {
            return e.parents('#flower-password-input').size() > 0;
        }
        $(document).on('focus.fp', 'input:password', function() {
            if (insideBox($(this))) {
                return;
            }
            lazyInject();
            if (!currentField || currentField.get(0) != this) {
                $('#flower-password-password').val('');
                fillKey(true);
            }
            currentField = $(this);
            var offset = currentField.offset();
            var height = currentField.outerHeight();
            $('#flower-password-input').css({left: offset.left + "px", top: offset.top + height + "px"}).show();
        });
        $(document).on('focus.fp', 'input:not(:password)', function() {
            if (insideBox($(this))) {
                return;
            }
            $('#flower-password-input').hide();
        });
        $(document).on('keydown.fp', function(e) {
            if (matchKey(e, 87, {alt: true})) {
                $('#flower-password-input').hide();
            }
        });
    } else {
        $(document).off('.fp');
    }
}

function isInjected() {
    return $('#flower-password-input').size() > 0;
}

function lazyInject() {
    if (!isEnabled() || isInjected()) {
        return;
    }

    var getURL = chrome.extension.getURL;
    $('body').append(
        '<div id="flower-password-input" style="display: none;">' +
            '<span id="flower-password-close" title="关闭">关闭</span>' +
            '<h1>花密 Flower Password <a href="http://kisexu.com/huami/" target="_blank"><img src="' + getURL('img/goto.png') + '" title="打开花密官网" /></a></h1>' +
            '<div class="field"><label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value="" maxlength="20" accesskey="S" /></div>' +
            '<div class="field"><label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value="" maxlength="15" /></div>' +
            '<div class="field"><input id="flower-password-fill-key" name="flower-password-fill-key" type="checkbox" /><label for="flower-password-fill-key">默认将网站域名填入区分代号</label></div>' +
            '<div class="field"><input id="flower-password-append-scramble" name="flower-password-append-scramble" type="checkbox" /><label for="flower-password-append-scramble">在默认区分代号后加上附加扰码</label></div>' +
            '<div class="field" id="flower-password-scramble-field" style="display: none;"><label for="flower-password-scramble">附加扰码</label><input id="flower-password-scramble" name="flower-password-scramble" type="text" value="" maxlength="15" /></div>' +
            '<div id="flower-password-toolbar"><a href="' + getURL('options.html') + '" target="_blank"><img src="' + getURL('img/options.png') + '" /> 设置</a><a id="flower-password-hint-control"><img src="' + getURL('img/shrink.png') + '" /> 收起</a></div>' +
            '<ul id="flower-password-hint">' +
                '<li>记忆密码：可选择一个简单易记的密码，用于生成其他高强度密码。</li>' +
                '<li>区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。</li>' +
                '<li>附加扰码：添加到默认填写的区分代号后面，用于提高区分代号的强度，应选取一个有别于所有密码的值。</li>' +
                '<li>快捷键：Alt+S聚焦到记忆密码输入框；在页面任意地方按Alt+W，或者在上面两输入框中按Enter或Esc将关闭本窗口。</li>' +
            '</ul>' +
        '</div>'
    );
    $('head').append(
        '<style type="text/css">' +
            '#flower-password-input input[type="checkbox"]:checked::after { content: url(' + chrome.extension.getURL('img/checkmark.png') + '); }' +
        '</style>'
    );

    $('#flower-password-close').click(function() {
        $('#flower-password-input').hide();
    });

    var onPasswordChange = function() {
        var password = $("#flower-password-password").val();
        var key = $("#flower-password-key").val();
        var result = countCode(password, key);
        if (result) {
            var code = result[0];
            setInputValue(currentField, code);
        }
    };
    $('#flower-password-password, #flower-password-key').change(onPasswordChange).keyup(onPasswordChange).keyup(function(e) {
        if (matchKey(e, 13) || matchKey(e, 27)) {
            currentField.focus();
            $('#flower-password-input').hide();
        }
    });

    $('#flower-password-fill-key').prop("checked", isFillKeyWithDomain()).change(function(e) {
        setFillKeyWithDomain(this.checked);
        fillKey();
    });

    var setupScrambleField = function() {
        if (isAppendScramble() && getScramble() == '') {
            $('#flower-password-scramble').val(getScramble());
            $('#flower-password-scramble-field').show();
        } else {
            $('#flower-password-scramble-field').hide();
        }
    };
    $('#flower-password-append-scramble').prop("checked", isAppendScramble()).change(function(e) {
        setAppendScramble(this.checked);
        fillKey();
        setupScrambleField();
    });
    setupScrambleField();

    var onScrambleChange = function() {
        setScramble(this.value);
        fillKey();
    };
    $('#flower-password-scramble').change(onScrambleChange).keyup(onScrambleChange);

    var setupHint = function() {
        if (isShowHint()) {
            $('#flower-password-hint-control').html('<img src="' + chrome.extension.getURL('img/shrink.png') + '" /> 收起');
            $('#flower-password-hint').show();
        } else {
            $('#flower-password-hint-control').html('<img src="' + chrome.extension.getURL('img/expand.png') + '" /> 提示');
            $('#flower-password-hint').hide();
        }
    }
    $('#flower-password-hint-control').click(function() {
        setShowHint(!isShowHint());
        setupHint();
    });
    setupHint();
}

onSetEnabled = function() {
    setupInputListeners();
    if (!isEnabled()) {
        $('#flower-password-input').hide();
    }
};

initOptions(); // initOptions() will call onSetEnabled()
