const BaseController = require('../base/Controller');

let ResultsController = {
    init: function (pageView, professionsModel, answersModel, xhr, tracker, professionCode) {
        this.pageView = pageView;
        this.professionsModel = professionsModel;
        this.professionCode = professionCode;
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

    getAnsweredCompetencies: function () {
        let competencyRatings = this.answersModel.getAllRatings();
        let competenciesWithRatings = [];

        Object.keys(competencyRatings).forEach(function (competencyCode) {
            let competency = this.professionsModel.getAnyProfessionCompetency(competencyCode);

            if (competency) {
                let rating = competencyRatings[competencyCode];
                let ratingPercent = this.answersModel.getRatingPercent(rating);

                competenciesWithRatings.push({
                    name: competency.name,
                    code: competency.code,
                    rating: rating,
                    ratingPercent: ratingPercent
                });
            }
        }, this);

        return competenciesWithRatings;
    },

    getRatingAverage: function (competency, rating) {
        let lowerRating = 1;
        let upperRating = 2;
        let averageRating = 1.5;

        let diff = false;

        if (rating !== false) {
            diff = rating < lowerRating
                ? rating - lowerRating
                : (rating > upperRating
                        ? rating - upperRating
                        : 0
                );
        }

        return {
            lower: this.answersModel.getRatingPercent(lowerRating),
            upper: this.answersModel.getRatingPercent(upperRating),
            average: this.answersModel.getRatingPercent(averageRating),
            diff: diff !== false ? this.answersModel.getRatingPercent(diff) : false
        }
    },

    getProfessionCompetenciesWithAnswers: function () {
        let competencyRatings = this.answersModel.getAllRatings();
        let professionCompetencies = this.professionsModel.getCompetencies(this.professionCode);
        let competenciesWithRatings = [];

        professionCompetencies.forEach(function (competency) {
            let rating = competencyRatings[competency.code] || false;
            let ratingPercent = rating ? this.answersModel.getRatingPercent(rating) : false;
            let evaluateLink = '/test/'+this.professionCode+'/'+competency.code;

            competenciesWithRatings.push({
                name: competency.name,
                code: competency.code,
                average: this.getRatingAverage(competency, rating),
                link: evaluateLink,
                rating: rating,
                ratingPercent: ratingPercent
            });
        }, this);

        return competenciesWithRatings;
    },

    getViewModel: function () {
        let profession = this.professionsModel.getProfession(this.professionCode);

        return {
            'allCompetencies': this.getAnsweredCompetencies(),
            'professionName': profession.name,
            'coursesLink': '/courses/'+profession.code,
            'professionCompetencies': this.getProfessionCompetenciesWithAnswers()
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
 * @param {string} professionCode
 * @returns {ResultsController}
 */
module.exports = function (pageView, professionsModel, answersModel, xhr, tracker, professionCode) {
    let instance = Object.create(ResultsController);

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    instance.init(pageView, professionsModel, answersModel, xhr, tracker, professionCode);

    return instance;
};