const BaseController = require('../base/Controller');

let ResultsController = {
    init: function (pageView, professionsModel, answersModel, xhr, tracker) {
        this.pageView = pageView;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.element = pageView.getRootElement();
        this.xhr = xhr;
        this.tracker = tracker;
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
        ];

        if (this.xhr) {
            this.events.push({types: ['load'], target: this.xhr, handler: this.saveSuccess});
        }

        this.bindEvents();
    },

    initViewEvents: function () {
        let additionalEvents = [
            {types: ['save'], target: this.answersModel, handler: this.saveSuccess},
            {types: ['click'], target: this.pageView.getSaveButton(), handler: this.saveResults}
        ];

        this.events = this.events.concat(additionalEvents);

        this.bindEvents(additionalEvents);
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.professionsModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.professionsModel.load();
        }
    },

    getViewModel: function () {
        let competencyRatings = this.answersModel.getAllRatings();
        let competenciesWithRatings = [];

        Object.keys(competencyRatings).forEach(function (competencyCode) {
            let competency = this.professionsModel.getAnyProfessionCompetency(competencyCode);

            if (competency) {
                let rating = competencyRatings[competencyCode];
                let maxRating = 4;
                let ratingPercent = Math.round(rating/maxRating*100);

                competenciesWithRatings.push({
                    name: competency.name,
                    code: competency.code,
                    rating: rating,
                    ratingPercent: ratingPercent
                });
            }
        }, this);

        return {
            'pollUrl': 'https://11713.typeform.com/to/oe9WIB',
            'allCompetencies': competenciesWithRatings
        };
    },

    renderIndexPageAfterLoad: function () {
        this.pageView.render(this.getViewModel());
        this.initViewEvents();
    },

    trackSaveResults: function () {
        if (this.tracker) {
            this.tracker.trackSaveResults();
        }
    },

    /**
     * @param {Event} event
     */
    saveResults: function (event) {
        event.preventDefault();
        let subscribeForm = this.pageView.getSubscribeForm();
        let data = new FormData(subscribeForm);
        this.answersModel.saveResults(data);
    },

    saveSuccess: function (event) {
        this.trackSaveResults();
        this.pageView.showSuccessModal();
    }
};

ResultsController = Object.assign(Object.create(BaseController), ResultsController);

/**
 * @param pageView
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @param {XMLHttpRequest} xhr
 * @param {GTagTracker} tracker
 * @returns {ResultsController}
 */
module.exports = function (pageView, professionsModel, answersModel, xhr, tracker) {
    let instance = Object.create(ResultsController);

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    instance.init(pageView, professionsModel, answersModel, xhr, tracker);

    return instance;
};