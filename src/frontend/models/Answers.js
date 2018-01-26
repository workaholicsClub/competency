const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');

var AnswersModel = {
    init: function (props, config, xhr) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.url = '/courses/recommend';
        this.config = config;

        this.recommendations = [];
        this.isLoadedFlag = false;
    },

    /**
     * @param {string} competencyCode
     * @returns {number|boolean}
     */
    getCompetencyRating: function (competencyCode) {
        var answers = this.get(competencyCode);
        var maxLevelRating = 4;

        if ( !(answers instanceof Array) ) {
            return false;
        }

        if ( answers.length < 4 ) {
            return false;
        }

        var answersAllMissed = answers.reduce(function (allMissedAccumulator, current) {
            var isMissedAnswer = current === false || current === 0;
            allMissedAccumulator = allMissedAccumulator && isMissedAnswer;

            return allMissedAccumulator;
        }, true);

        if (answersAllMissed) {
            return false;
        }

        var normalizedAnswers = answers.map(function (answer) {
            var noAnswer = 0;
            var notMatchingAnswer = 1;

            if (answer === noAnswer) {
                answer = notMatchingAnswer;
            }

            return (answer-1)/maxLevelRating;
        });

        var rating = normalizedAnswers.reduce(function (arraySum, current) {
            return arraySum + current;
        });

        var humanRating = parseFloat( rating.toFixed(2) );

        return (!answersAllMissed) ? humanRating : false;
    },

    getAllRatings: function () {
        var competencyCodes = Object.keys(this.props);
        var ratings = {};

        competencyCodes.forEach(function (competencyCode) {
            ratings[competencyCode] = this.getCompetencyRating(competencyCode);
        }, this);

        return ratings;
    },

    makeRequestUrl: function () {
        var ratings = this.getAllRatings();
        var competencyCodes = Object.keys(ratings);

        var queryParams = competencyCodes.reduce(function (accumulator, competencyCode) {
            accumulator.push('competency[' + competencyCode + ']=' + ratings[competencyCode]);
            return accumulator;
        }, []);
        var query = queryParams.join('&');

        return this.config.makeAbsoluteApiUrl(this.url) + '?' + query;
    },

    loadRecommendations: function () {
        this.isLoadedFlag = false;
        this.load();
    },

    afterLoad: function (xhr, event, response) {
        this.recommendations = response.course;
        this.isLoadedFlag = true;
    },

    isLoaded: function () {
        return this.isLoadedFlag;
    },

    getRecommendations: function () {
        return this.recommendations;
    }
};

AnswersModel = Object.assign(Object.create(BaseModel), AnswersModel);
AnswersModel = Object.assign(AnswersModel, XhrModelMixin);

/**
 * @param props
 * @param config
 * @param xhr
 * @returns {AnswersModel}
 */
module.exports = function (props, config, xhr) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    var answers = Object.create(AnswersModel);
    answers.init(props, config, xhr);

    return answers;
};