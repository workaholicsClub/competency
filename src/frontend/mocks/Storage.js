const StateMixin = require('../models/StateMixin');
let MemoryStorage = {
    init: function (cookieName) {
        this.cookieName = cookieName;
        this.initProps({});
    },

    save: function (data) {
        this.setWithoutEvent(this.cookieName, data);
    },

    load: function () {
        return this.get(this.cookieName);
    }
};

MemoryStorage = Object.assign(MemoryStorage, StateMixin);

/**
 * @param cookieName
 * @returns {Storage}
 */
module.exports = function (cookieName) {
    let instance = Object.create(MemoryStorage);
    instance.init(cookieName);

    return instance;
};