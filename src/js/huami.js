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

function matchKey(e, which, ctrl, alt, shift, meta) {
    return e.which == which && e.ctrlKey == ctrl && e.altKey == alt && e.shiftKey == shift && e.metaKey == meta;
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
                if (isFillKeyWithDomain()) {
                    $("#flower-password-key").val(getDomain(window.location.hostname));
                } else {
                    $("#flower-password-key").val('');
                }
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
            if (matchKey(e, 87, false, true, false, false)) {
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

    $('body').append(
        '<div id="flower-password-input" style="display: none;">' +
            '<span id="flower-password-close" title="关闭">关闭</span>' +
            '<h1>花密 Flower Password <a href="http://kisexu.com/huami/" target="_blank"><img src="' + chrome.extension.getURL('img/goto.png') + '" title="打开花密官网" /></a></h1>' +
            '<label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value="" maxlength="20" accesskey="S" />' +
            '<br>' +
            '<label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value="" maxlength="20" />' +
            '<br>' +
            '<input id="flower-password-fill-key" name="flower-password-fill-key" type="checkbox" /><label for="flower-password-fill-key">默认将网站域名填入区分代号</label>' +
            '<span id="flower-password-toolbar"><a href="' + chrome.extension.getURL('options.html') + '" target="_blank"><img src="' + chrome.extension.getURL('img/options.png') + '" /> 设置</a><a id="flower-password-hint-control"><img src="' + chrome.extension.getURL('img/shrink.png') + '" /> 收起</a></span>' +
            '<p id="flower-password-hint">· 记忆密码：可选择一个简单易记的密码，用于生成其他高强度密码。<br>· 区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。<br>· 快捷键：Alt+S聚焦到记忆密码输入框；在页面任意地方按Alt+W，或者在上面两输入框中按Enter或Esc将关闭本窗口。</p>' +
        '</div>'
    );
    $('head').append(
        '<style type="text/css">' +
            '#flower-password-input input[type="checkbox"]:checked::after { content: url(' + chrome.extension.getURL('img/checkmark.png') + '); }' +
        '</style>'
    );

    var onChange = function() {
        var password = $("#flower-password-password").val();
        var key = $("#flower-password-key").val();
        var result = countCode(password, key);
        if (result) {
            var code = result[0];
            var maxlength = parseInt(currentField.prop('maxlength'));
            if (maxlength < 16) {
                code = code.slice(0, maxlength);
            }
            currentField.val(code);
        }
    };
    $('#flower-password-password, #flower-password-key').change(onChange).keyup(onChange).keyup(function(e) {
        if (matchKey(e, 13, false, false, false, false) || matchKey(e, 27, false, false, false, false)) {
            currentField.focus();
            $('#flower-password-input').hide();
        }
    });

    $('#flower-password-fill-key').change(function(e) {
        var checked = this.checked;
        setFillKeyWithDomain(checked);
        if (checked && $("#flower-password-key").val() == '') {
            $("#flower-password-key").val(getDomain(window.location.hostname));
        }
    });

    $('#flower-password-close').click(function() {
        $('#flower-password-input').hide();
    });

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

    $('#flower-password-fill-key').prop("checked", isFillKeyWithDomain());
}

onSetEnabled = function() {
    setupInputListeners();
    if (!isEnabled()) {
        $('#flower-password-input').hide();
    }
};

initOptions(); // initOptions() will call onSetEnabled()
