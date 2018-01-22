const StateMixin = require('../models/StateMixin');

var Config = {
    init: function (incomingConfig) {
        var config = incomingConfig || {
            staticUrl: __STATIC_URL__,
            apiUrl: __API_URL__
        };

        this.initProps(config);
    },

    makeAbsoluteStaticUrl: function (relativeUrl) {
        return this.get('staticUrl') + relativeUrl;
    },

    makeAbsoluteApiUrl: function (relativeUrl) {
        return this.get('apiUrl') + relativeUrl;
    }
};

Config = Object.assign(Config, StateMixin);

module.exports = function (incomingConfig) {
    var instance = Object.create(Config);
    instance.init(incomingConfig);

    return instance;
};
module.exports.class = Config;