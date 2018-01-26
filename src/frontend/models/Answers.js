const BaseModel = require('./Base');

var AnswersModel = {
    init: function (props, config) {
        this.initPropsAndEvents(props);
        this.config = config;
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

        var normalizedAnswers = answers.map(function (answer) {
            return (answer-1)/maxLevelRating;
        });

        var rating = normalizedAnswers.reduce(function (arraySum, current) {
            return arraySum + current;
        });

        var humanRating = parseFloat( rating.toFixed(2) );

        return rating !== -1 ? humanRating : false;
    },

    getAllRatings: function () {
        var competencyCodes = Object.keys(this.props);
        var ratings = {};

        competencyCodes.forEach(function (competencyCode) {
            ratings[competencyCode] = this.getCompetencyRating(competencyCode);
        }, this);

        return ratings;
    }
};

AnswersModel = Object.assign(Object.create(BaseModel), AnswersModel);

/**
 * @param props
 * @param config
 * @returns {AnswersModel}
 */
module.exports = function (props, config) {
    if (!props) {
        props = {};
    }

    var answers = Object.create(AnswersModel);
    answers.init(props, config);

    return answers;
};