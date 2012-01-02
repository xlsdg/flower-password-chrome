(function($) {
    $.isUndefined = function(value) {
        return typeof value === 'undefined';
    };
    $.isNotUndefined = function(value) {
        return !$.isUndefined(value);
    };
})(typeof jQuery === 'function' ? jQuery : this);
