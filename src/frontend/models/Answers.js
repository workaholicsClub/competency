const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');
const StorageMixin = require('./StorageMixin');
const cookieStorageFactory = require('../classes/CookieStorage');

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
        let maxLevelRating = 4;

        if ( !(answers instanceof Array) ) {
            return false;
        }

        if ( answers.length < 4 ) {
            return false;
        }

        let answersAllMissed = answers.reduce(function (allMissedAccumulator, current) {
            let isMissedAnswer = current === false || current === 0;
            allMissedAccumulator = allMissedAccumulator && isMissedAnswer;

            return allMissedAccumulator;
        }, true);

        if (answersAllMissed) {
            return false;
        }

        let normalizedAnswers = answers.map(function (answer) {
            let noAnswer = 0;
            let notMatchingAnswer = 1;

            if (answer === noAnswer) {
                answer = notMatchingAnswer;
            }

            return (answer-1)/maxLevelRating;
        });

        let rating = normalizedAnswers.reduce(function (arraySum, current) {
            return arraySum + current;
        });

        let humanRating = parseFloat( rating.toFixed(2) );

        return (!answersAllMissed) ? humanRating : false;
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

        return [
            'Не знаю',
            'Знаю',
            'Осознанно применяю',
            'Применяю автоматически'
        ];
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

    if (!xhr) {
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

module.exports.class = AnswersModel;