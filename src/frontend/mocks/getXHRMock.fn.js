module.exports = function (response, async, url) {
    if (!url) {
        url = ''
    }

    return {
        callback: {},
        responseType: 'load',
        responseText: response,
        responseURL: url,
        addEventListener: function (type, callback) {
            this.callback[type] = callback;
        },
        open: function () {},
        send: function () {
            let event = {};
            let xhr = this;
            let loadTimeMs = 50;

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