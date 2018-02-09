/**
 * Отслеживание событий при помощи Google Global Site Tag
 * @type {{init: GTagTracker.init, trackPageview: GTagTracker.trackPageview, trackFormSubmit: GTagTracker.trackFormSubmit}}
 *
 * @see https://developers.google.com/gtagjs/?hl=ru
 * @see https://developers.google.com/gtagjs/reference/event?hl=ru
 */

var GTagTracker = {
    init: function (gtagInstance, config) {
        this.gtag = gtagInstance;
        this.config = config;

        this.gtag('config', this.config.get('gaTrackingId'), {'send_page_view': false});
        this.gtag('config', this.config.get('awCampaignId'));
    },


    trackPageview: function (url) {
        var currentUrl = url;
        if (!currentUrl) {
            currentUrl = window ? window.location.pathname : false;
        }

        this.gtag('config', this.config.get('gaTrackingId'), {'page_location': currentUrl});
    },

    trackSaveResults: function () {
        this.gtag('event', 'conversion', {'send_to': this.config.get('awGoogleConversionId')});
    }
};

module.exports = function (gtagInstance, config) {
    if (!gtagInstance && gtag) {
        gtagInstance = gtag;
    }

    var instance = Object.create(GTagTracker);
    instance.init(gtagInstance, config);

    return instance;
};