module.exports = function (response, async) {
    return {
        callback: {},
        responseType: 'load',
        responseText: response,
        addEventListener: function (type, callback) {
            this.callback[type] = callback;
        },
        open: function () {},
        send: function () {
            var event = {};
            var xhr = this;
            var loadTimeMs = 50;

            if (async) {
                setTimeout(function () {
                    xhr.callback[xhr.responseType](event);
                }, loadTimeMs);
            }
            else {
                xhr.callback[xhr.responseType](event);
            }
        }
    };
};