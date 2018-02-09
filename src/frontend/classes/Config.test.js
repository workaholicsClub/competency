const configFactory = require('./Config');

test('Config.getters', function () {
    var config = configFactory({
        staticUrl: '//test.static.url',
        apiUrl: '//test.api.url',
        gaTrackingId: 'UA-12345-6',
        awCampaignId: 'AW-123456789',
        awGoogleConversionId: 'AW-123456789/xyz'
    });

    expect(config.get('staticUrl'))
        .toBe('//test.static.url');
    expect(config.makeAbsoluteStaticUrl('/f/latest/pfsquaresanspro-mediumwebfont.eot'))
        .toBe('//test.static.url/f/latest/pfsquaresanspro-mediumwebfont.eot');
    expect(config.makeAbsoluteApiUrl('/v2/policy'))
        .toBe('//test.api.url/v2/policy');

    expect(config.get('gaTrackingId')).toBe('UA-12345-6');
    expect(config.get('awCampaignId')).toBe('AW-123456789');
    expect(config.get('awGoogleConversionId')).toBe('AW-123456789/xyz');
});