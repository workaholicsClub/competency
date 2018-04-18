const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');
const StorageMixin = require('./StorageMixin');
const cookieStorageFactory = require('../classes/CookieStorage');

let skillCodes = [
    'none',
    'knowledge',
    'skill',
    'ability'
];

let skillTexts = [
    'Не знаю',
    'Знаю',
    'Осознанно применяю',
    'Применяю автоматически'
];

let AnswersModel = {
    init: function (props, config, xhr, storage, autoload) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.initStorage(storage);
        this.config = config;

        if (autoload) {
            this.loadAnswers();
        }
        this.bindChangeHandlers();
    },

    /**
     * @param {string} competencyCode
     * @returns {number|boolean}
     */
    getCompetencyRating: function (competencyCode) {
        let answers = this.get(competencyCode);

        if (!answers) {
            return false;
        }

        if ( !(answers instanceof Array) ) {
            return false;
        }

        let sum = answers.reduce(function (arraySum, current) {
            return arraySum + current;
        });

        let rating = sum/answers.length;
        let humanRating = parseFloat( rating.toFixed(2) );

        return humanRating;
    },

    getAllRatings: function () {
        let competencyCodes = Object.keys(this.props);
        let ratings = {};

        competencyCodes.forEach(function (competencyCode) {
            ratings[competencyCode] = this.getCompetencyRating(competencyCode);
        }, this);

        return ratings;
    },

    bindChangeHandlers: function () {
        let model = this;
        this.addEventListener('change', function (event) {
            model.saveAnswers.call(model, event);
        });
    },

    /**
     * @param event
     */
    saveAnswers: function (event) {
        this.saveData(event);
    },

    loadAnswers: function () {
        this.loadData();
    },

    /**
     * @param {FormData} formData
     */
    saveResults: function (formData) {
        let saveUrl = '/api/results/save';

        this.xhr.open("POST", saveUrl);
        this.xhr.send(formData);
    },

    afterLoad: function (xhr, event, response) {
        this.saveSuccess(xhr, event, response)
    },

    saveSuccess: function (xhr, event, response) {
        if (response && response.success === true) {
            this.dispatchModelEvent('save');
        }
        else {
            this.dispatchModelEvent('saveError');
        }
    },

    getSkillLevelsText: function() {
        //['осведомленность', 'умение', 'экспертиза', 'лидерство']
        //['знаю', 'умею', 'имею навык', 'могу обучать']
        //['ознакомительный', 'воспроизводственный', 'реконструктивный', 'творческий']
        //['Ознакомлен', 'Повторяю чьи-то действия', 'Осмысляю, отношусь критически', 'Занимаюсь творчеством'];

        return skillTexts;
    },

    getSkillLevelsCode: function() {
        return skillCodes;
    },

    getRatingPercent: function (rating) {
        if (!rating) {
            return rating === 0 ? 0 : false;
        }

        let maxRating = this.getSkillLevelsText().length-1;
        return Math.round(rating/maxRating*100);
    },

    getAnsweredSkills: function (competency) {
        let competencyCode = competency.code;
        let competencySkills = competency.skills;
        let answers = this.get(competencyCode) || false;
        let skillAnswersText = this.getSkillLevelsText();

        let skills = [];
        competencySkills.forEach(function (skill, index) {
            let answer = answers ? (answers[index] || false) : false;
            let answerValue = answer !== false
                ? parseInt(answer).toString()
                : '0';

            skills.push({
                answer: answerValue,
                answerText: answer > 0
                    ? skillAnswersText[answer]
                    : skillAnswersText[0],
                isAnswered: answer > 0,
                text: skill.text,
                additionalDescription: skill.additionalDescription
            });
        });

        return skills;
    }
};

AnswersModel = Object.assign(Object.create(BaseModel), AnswersModel);
AnswersModel = Object.assign(AnswersModel, XhrModelMixin);
AnswersModel = Object.assign(AnswersModel, StorageMixin);

/**
 * @param props
 * @param config
 * @param xhr
 * @param {Storage} storage
 * @param {boolean} autoload
 * @returns {AnswersModel}
 */
module.exports = function (props, config, xhr, storage, autoload) {
    if (!props) {
        props = {};
    }

    if (typeof (xhr) === 'undefined') {
        xhr = new XMLHttpRequest();
    }

    if (!storage) {
        storage = cookieStorageFactory('answers');
    }

    if (typeof (autoload) === 'undefined') {
        autoload = true;
    }

    let answers = Object.create(AnswersModel);
    answers.init(props, config, xhr, storage, autoload);

    return answers;
};

module.exports.skillCodes = skillCodes;
module.exports.class = AnswersModel;