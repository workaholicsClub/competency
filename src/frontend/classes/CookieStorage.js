const Cookie = require('js-cookie');

let CookieStorage = {
    init: function (cookieName, expiresDays) {
        this.cookieName = cookieName;
        this.expiresDays = expiresDays;
    },

    save: function (data) {
        Cookie.set(this.cookieName, data, {expires: this.expiresDays});
    },

    load: function () {
        return Cookie.getJSON(this.cookieName);
    }
};

module.exports = function (cookieName, expiresDays) {
    let instance = Object.create(CookieStorage);
    if (!expiresDays) {
        expiresDays = 10;
    }
    
    instance.init(cookieName, expiresDays);

    return instance;
};