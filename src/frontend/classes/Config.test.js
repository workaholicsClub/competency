const configFactory = require('./Config');

test('Config.getters', function () {
    var config = configFactory({
        staticUrl: '//test.static.url',
        apiUrl: '//test.api.url'
    });

    expect(config.get('staticUrl'))
        .toBe('//test.static.url');
    expect(config.makeAbsoluteStaticUrl('/f/latest/pfsquaresanspro-mediumwebfont.eot'))
        .toBe('//test.static.url/f/latest/pfsquaresanspro-mediumwebfont.eot');
    expect(config.makeAbsoluteApiUrl('/v2/policy'))
        .toBe('//test.api.url/v2/policy');
});