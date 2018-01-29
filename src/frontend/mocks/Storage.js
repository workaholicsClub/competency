const StateMixin = require('../models/StateMixin');
var MemoryStorage = {
    init: function (cookieName) {
        this.cookieName = cookieName;
        this.initProps({});
    },

    save: function (data) {
        this.set(this.cookieName, data);
    },

    load: function () {
        return this.get(this.cookieName);
    }
};

MemoryStorage = Object.assign(MemoryStorage, StateMixin);

module.exports = function (cookieName) {
    var instance = Object.create(MemoryStorage);
    instance.init(cookieName);

    return instance;
};