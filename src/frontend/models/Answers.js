const BaseModel = require('./Base');
const XhrModelMixin = require('./XhrModelMixin');
const cookieStorageFactory = require('../classes/CookieStorage');

var AnswersModel = {
    init: function (props, config, xhr, storage) {
        this.initPropsAndEvents(props);
        this.initXhr(xhr);
        this.config = config;
        this.storage = storage;

        this.loadAnswers();
        this.bindChangeHandlers();
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

    bindChangeHandlers: function () {
        var model = this;
        this.addEventListener('change', function (event) {
            model.saveAnswers.call(model, event);
        });
    },

    /**
     * @param event
     */
    saveAnswers: function (event) {
        if (this.storage) {
            this.storage.save(this.getProps());
        }
    },

    loadAnswers: function () {
        if (this.storage) {
            var savedAnswers = this.storage.load();

            if (savedAnswers) {
                this.setPropsWithoutEvent(savedAnswers);
            }
        }
    },

    /**
     * @param {FormData} formData
     */
    saveResults: function (formData) {
        var saveUrl = '/api/results/save';

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
        return [
            'Не знаю',
            'Ознакомлен',
            'Действую повторением',
            'Действую на автомате, отношусь критически',
            'Использую в творческой деятельности'
        ];
    }
};

AnswersModel = Object.assign(Object.create(BaseModel), AnswersModel);
AnswersModel = Object.assign(AnswersModel, XhrModelMixin);

/**
 * @param props
 * @param config
 * @param xhr
 * @param storage
 * @returns {AnswersModel}
 */
module.exports = function (props, config, xhr, storage) {
    if (!props) {
        props = {};
    }

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    if (!storage) {
        storage = cookieStorageFactory('answers');
    }

    var answers = Object.create(AnswersModel);
    answers.init(props, config, xhr, storage);

    return answers;
};

module.exports.class = AnswersModel;