(function($) {
    $.isUndefined = function(value) {
        return typeof value === 'undefined';
    };
    $.isNotUndefined = function(value) {
        return !$.isUndefined(value);
    };
})(typeof jQuery === 'function' ? jQuery : this);

if (typeof jQuery === 'function') {
    (function($) {
        function isModifierSet(modifier, name) {
            return $.isNotUndefined(modifier) && (modifier[name] == true);
        }

        $.Event.prototype.matchKey = function(which, modifier) {
            var ctrl = isModifierSet(modifier, 'ctrl');
            var alt = isModifierSet(modifier, 'alt');
            var shift = isModifierSet(modifier, 'shift');
            var meta = isModifierSet(modifier, 'meta');
            return this.which == which && this.ctrlKey == ctrl && this.altKey == alt && this.shiftKey == shift && this.metaKey == meta;
        };

        $.fn.valLimited = function(value) {
            var maxlength = parseInt(this.prop('maxlength'));
            if (maxlength < value.length) {
                value = value.slice(0, maxlength);
            }
            this.val(value);
        }
    })(jQuery);
}
