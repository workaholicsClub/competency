const Cookie = require('js-cookie');

var CookieStorage = {
    init: function (cookieName) {
        this.cookieName = cookieName;
        this.expiresDays = 10;
    },

    save: function (data) {
        Cookie.set(this.cookieName, data, {expires: this.expiresDays});
    },

    load: function () {
        return Cookie.getJSON(this.cookieName);
    }
};

module.exports = function (cookieName) {
    var instance = Object.create(CookieStorage);
    instance.init(cookieName);

    return instance;
};