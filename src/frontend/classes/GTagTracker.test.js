const trackerFactory = require('./GTagTracker');
const configMockFactory = require('../mocks/Config');

test('GTagTracker events', function () {
    var gtag = jest.fn();
    var config = configMockFactory();

    var tracker = trackerFactory(gtag, config);
    expect(gtag).toHaveBeenCalledTimes(2);

    var callArguments = gtag.mock.calls;
    expect(callArguments[0][0]).toBe('config');
    expect(callArguments[0][1]).toBe( config.get('gaTrackingId') );
    expect(callArguments[1][0]).toBe('config');
    expect(callArguments[1][1]).toBe( config.get('awCampaignId') );

    tracker.trackPageview();
    tracker.trackSaveResults();

    expect(gtag).toHaveBeenCalledTimes(4);
});