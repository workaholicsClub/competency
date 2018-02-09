const configFactory = require('../classes/Config');

var ConfigMock = Object.assign(Object.create(configFactory.class), {
    init: function () {
        var staticUrl = '//test.static.url';

        var config = {
            staticUrl: staticUrl,
            apiUrl: '//test.api.url',
            gaTrackingId: 'UA-12345-6',
            awCampaignId: 'AW-123456789',
            awGoogleConversionId: 'AW-123456789/xyz'
        };

        this.initProps(config);
    }
});

module.exports = function () {
    var instance = Object.create(ConfigMock);
    instance.init();

    return instance;
};