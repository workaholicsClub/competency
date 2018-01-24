var Polyfills = {
    init: function () {
        this.objectAssign();
        this.elementClosest();
    },

    /*
     * Полифилл из MDN
     * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
     */
    objectAssign: function () {
        if (!Object.assign) {
            Object.defineProperty(Object, 'assign', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function(target, firstSource) {
                    'use strict';
                    if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert first argument to object');
                    }

                    var to = Object(target);
                    for (var i = 1; i < arguments.length; i++) {
                        var nextSource = arguments[i];
                        if (nextSource === undefined || nextSource === null) {
                            continue;
                        }

                        var keysArray = Object.keys(Object(nextSource));
                        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                            var nextKey = keysArray[nextIndex];
                            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                            if (desc !== undefined && desc.enumerable) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                    return to;
                }
            });
        }
    },

    /*
     * Полифилл из MDN
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
     */
    elementClosest: function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }

        if (!Element.prototype.closest) {
            /**
             * @param {string} s
             * @returns {Element|null}
             */
            Element.prototype.closest = function (s) {
                var el = this;

                var isBrowser = typeof(process) !== 'object';

                if (isBrowser && !document.documentElement.contains(el)) {
                    return null;
                }

                do {
                    if (el.matches(s)) {
                        return el;
                    }

                    el = el.parentElement || el.parentNode;
                }
                while (el !== null && el.nodeType === 1);

                return null;
            };
        }
    }
};

module.exports = function () {
    var instance = Object.create(Polyfills);
    instance.init();

    return instance;
};