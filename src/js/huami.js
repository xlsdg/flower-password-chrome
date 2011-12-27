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

$('body').append(
    '<div id="flower-password-input" style="display: none;">' +
        '<span id="flower-password-close" title="关闭">关闭</span>' +
        '<h1>花密 Flower Password</h1>' +
        '<label for="flower-password-password">记忆密码</label><input id="flower-password-password" name="flower-password-password" type="password" value="" maxlength="20" accesskey="S" />' +
        '<br>' +
        '<label for="flower-password-key">区分代号</label><input id="flower-password-key" name="flower-password-key" type="text" value="" maxlength="20" />' +
        '<br>' +
        '<input id="flower-password-fill-key" name="flower-password-fill-key" type="checkbox" /><label for="flower-password-fill-key">默认将网站域名填入分区代号</label>' +
        '<p>· 记忆密码：可选择一个简单易记的密码，用于生成其他高强度密码。<br>· 区分代号：用于区别不同用途密码的简短代号，如淘宝账号可用“taobao”或“tb”等。<br>· 快捷键：按Alt+S可聚焦到记忆密码输入框；按Enter键或Esc键关闭本窗口。<br>· 花密官网地址：<a href="http://kisexu.com/huami/" target="_blank">http://kisexu.com/huami/</a></p>' +
    '</div>'
);
$('head').append(
    '<style type="text/css">' +
        '#flower-password-input input[type="checkbox"]:checked::after { content: url(' + chrome.extension.getURL('img/checkmark.png') + '); }' +
    '</style>'
);

var insideBox = function(e) {
    return e.parents('#flower-password-input').size() > 0;
};

var currentField = null;
$(document).on('focus', 'input:password', function() {
    if (insideBox($(this))) {
        return;
    }
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
$(document).on('focus', 'input:not(:password)', function() {
    if (insideBox($(this))) {
        return;
    }
    $('#flower-password-input').hide();
});

var onChange = function() {
    var password = $("#flower-password-password").val();
    var key = $("#flower-password-key").val();
    var result = countCode(password, key);
    if (result) {
        currentField.val(result[0]);
    }
};
$('#flower-password-password, #flower-password-key').change(onChange).keyup(onChange).keyup(function(e) {
    if (e.which == 13 || e.which == 27) {
        currentField.focus();
        $('#flower-password-input').hide();
    }
});

initOptions(function() {
    $('#flower-password-fill-key').prop("checked", isFillKeyWithDomain());
});
$('#flower-password-fill-key').change(function(e) {
    var checked = $(this).prop("checked");
    setFillKeyWithDomain(checked);
    if (checked && $("#flower-password-key").val() == '') {
        $("#flower-password-key").val(getDomain(window.location.hostname));
    }
});

$('#flower-password-close').click(function() {
    $('#flower-password-input').hide();
});
