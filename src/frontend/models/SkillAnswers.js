const AnswersModel = require('./Answers').class;
const cookieStorageFactory = require('../classes/CookieStorage');

let SkillAnswersModel = {
    /**
     * @param {string} competencyCode
     * @returns {number|boolean}
     */
    getCompetencyRating: function (competencyCode) {
        let answers = this.get(competencyCode);

        if ( !(answers instanceof Array) ) {
            return false;
        }

        if (answers.length === 0) {
            return false;
        }

        let answersSum = answers.reduce(function (arraySum, current) {
            return arraySum + current;
        }, 0);

        let maxAnswers = answers.length * 4;
        let rating = answersSum / maxAnswers;
        let maxRatingCompat = 4;
        let ratingCompat = rating * maxRatingCompat;

        let humanRating = parseFloat( ratingCompat.toFixed(2) );

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

    let answers = Object.create(SkillAnswersModel);
    answers.init(props, config, xhr, storage);

    return answers;
};