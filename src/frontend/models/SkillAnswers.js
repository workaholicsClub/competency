const AnswersModel = require('./Answers').class;
const cookieStorageFactory = require('../classes/CookieStorage');

var SkillAnswersModel = {
    /**
     * @param {string} competencyCode
     * @returns {number|boolean}
     */
    getCompetencyRating: function (competencyCode) {
        var answers = this.get(competencyCode);

        if ( !(answers instanceof Array) ) {
            return false;
        }

        var answersSum = answers.reduce(function (arraySum, current) {
            return arraySum + current;
        });

        var maxAnswers = answers.length * 4;
        var rating = answersSum / maxAnswers;
        var maxRatingCompat = 4;
        var ratingCompat = rating * maxRatingCompat;

        var humanRating = parseFloat( ratingCompat.toFixed(2) );

        return humanRating;
    }
};

SkillAnswersModel = Object.assign(Object.create(AnswersModel), SkillAnswersModel);

/**
 * @param props
 * @param config
 * @param xhr
 * @param storage
 * @returns {SkillAnswersModel}
 */
module.exports = function (props, config, xhr, storage) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    if (!storage) {
        storage = cookieStorageFactory('skillAnswers');
    }

    var answers = Object.create(SkillAnswersModel);
    answers.init(props, config, xhr, storage);

    return answers;
};