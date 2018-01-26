const BaseController = require('../base/Controller');
const recommendationsViewFactory = require('./RecommendationsView');

var ResultsController = {
    init: function (pageView, recommendationsView, professionsModel, answersModel) {
        this.pageView = pageView;
        this.recommendationsView = recommendationsView;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.element = pageView.getRootElement();
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
    },

    initViewEvents: function () {
        var additionalEvents = [
            {types: ['load'], target: this.answersModel, handler: this.renderRecommendations}
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
                competenciesWithRatings.push({
                    name: competency.name,
                    code: competency.code,
                    rating: competencyRatings[competencyCode]
                });
            }
        }, this);

        return {
            'competencies': competenciesWithRatings,
            'recommendations': this.answersModel.getRecommendations()
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
        this.answersModel.loadRecommendations();
    }
};

ResultsController = Object.assign(Object.create(BaseController), ResultsController);

/**
 * @param pageView
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @returns {ResultsController}
 */
module.exports = function (pageView, professionsModel, answersModel) {
    var instance = Object.create(ResultsController);
    var recommendationsView = recommendationsViewFactory();

    instance.init(pageView, recommendationsView, professionsModel, answersModel);

    return instance;
};