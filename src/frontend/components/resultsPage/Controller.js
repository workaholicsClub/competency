const BaseController = require('../base/Controller');
const recommendationsViewFactory = require('./RecommendationsView');

var ResultsController = {
    init: function (pageView, recommendationsView, professionsModel, answersModel, coursesModel, xhr, tracker) {
        this.pageView = pageView;
        this.recommendationsView = recommendationsView;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.coursesModel = coursesModel;
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
        var additionalEvents = [
            {types: ['load'], target: this.coursesModel, handler: this.renderRecommendations},
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
        var competencyRatings = this.answersModel.getAllRatings();
        var competenciesWithRatings = [];

        Object.keys(competencyRatings).forEach(function (competencyCode) {
            var competency = this.professionsModel.getAnyProfessionCompetency(competencyCode);

            if (competency) {
                var rating = competencyRatings[competencyCode];
                var maxRating = 4;
                var ratingPercent = Math.round(rating/maxRating*100);

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
            'competencies': competenciesWithRatings,
            'recommendations': this.coursesModel.getRecommendations()
        };
    },

    renderRecommendations: function () {
        var viewModel = this.getViewModel();
        var recommendationsDOM = this.recommendationsView.createDOM(viewModel);
        this.pageView.getRecomendationsContainer().innerHTML = recommendationsDOM.outerHTML;
    },

    renderIndexPageAfterLoad: function () {
        this.pageView.render(this.getViewModel());
        this.initViewEvents();
        this.coursesModel.setRatings( this.answersModel.getAllRatings() );
        this.coursesModel.loadRecommendations();
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
        var subscribeForm = this.pageView.getSubscribeForm();
        var data = new FormData(subscribeForm);
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
 * @param {CoursesModel} coursesModel
 * @param {XMLHttpRequest} xhr
 * @param {GTagTracker} tracker
 * @returns {ResultsController}
 */
module.exports = function (pageView, professionsModel, answersModel, coursesModel, xhr, tracker) {
    var instance = Object.create(ResultsController);
    var recommendationsView = recommendationsViewFactory();

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    instance.init(pageView, recommendationsView, professionsModel, answersModel, coursesModel, xhr, tracker);

    return instance;
};