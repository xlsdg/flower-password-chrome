var options = {
    fillKeyWithDomain: true,
    showHint: true,
    defaultEnabled: true,
    defaultAppendScramble: false,
    scramble: ''
};

function readOptions() {
    for (var name in options) {
        if (typeof localStorage[name] == 'undefined') {
            setOption(name, options[name]);
        } else {
            options[name] = JSON.parse(localStorage[name]);
        }
    }
}

function setOption(name, value) {
    options[name] = value;
    localStorage[name] = JSON.stringify(value);
}
