const BaseController = require('../base/Controller');

var ResultsController = {
    init: function (view, professionsModel, answersModel) {
        this.view = view;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.element = view.getRootElement();
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
            'competencies': competenciesWithRatings
        };
    },

    renderIndexPageAfterLoad: function () {
        this.view.render(this.getViewModel());
        this.initViewEvents();
    }
};

ResultsController = Object.assign(Object.create(BaseController), ResultsController);

/**
 * @param view
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @returns {ResultsController}
 */
module.exports = function (view, professionsModel, answersModel) {
    var instance = Object.create(ResultsController);
    instance.init(view, professionsModel, answersModel);

    return instance;
};