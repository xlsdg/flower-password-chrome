var options = {
    transparent: false,
    saveLastKey: true,
    fillKeyWithDomain: true,
    showHint: true,
    defaultEnabled: true,
    defaultAppendScramble: false,
    scramble: ''
};

function readOptions() {
    for (var name in options) {
        if (isUndefined(localStorage[name])) {
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
