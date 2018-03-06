const BaseController = require('../base/Controller');

var TestController = {
    init: function (view, professionsModel, answersModel, professionCode, competencyCode) {
        this.view = view;
        this.filterModel = professionsModel;
        this.answersModel = answersModel;
        this.professionCode = professionCode;
        this.competencyCode = competencyCode;
        this.element = view.getRootElement();
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.filterModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
    },

    initViewEvents: function () {
        var additionalEvents = [
            {types: ['change'], target: this.view.getAllLevelSelects(), handler: this.markLevelCompletedAndUpdateAnswer},
            {types: ['input'], target: this.view.getAllSkillSliders(), handler: this.changeSliderDescriptionTextAndUpdateAnswer}
        ];

        this.events = this.events.concat(additionalEvents);

        this.bindEvents(additionalEvents);
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.filterModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.filterModel.load();
        }
    },

    getCompetencyCode: function () {
        var competencyCode = this.competencyCode;
        if (!competencyCode) {
            var competencies = this.filterModel.getCompetencies(this.professionCode);
            var firstCompetency = competencies[0];
            competencyCode = firstCompetency ? firstCompetency.code : false;
        }

        return competencyCode;
    },

    changeSliderDescriptionTextAndUpdateAnswer: function (event) {
        var sliderElement = event.currentTarget;
        var levelTexts = this.answersModel.getSkillLevelsText();
        this.view.updateSkillText(sliderElement, levelTexts);

        var answers = this.view.getLevelSkillAnswers();
        this.answersModel.set(this.getCompetencyCode(), answers);
    },

    /**
     * @param {Event} event
     */
    markLevelCompletedAndUpdateAnswer: function (event) {
        var selectElement = event.currentTarget;
        this.view.markLevelCompleted(selectElement);

        var answers = this.view.getLevelAnswers();
        this.answersModel.set(this.getCompetencyCode(), answers);
    },

    getViewModel: function () {
        var profession = this.filterModel.getProfession(this.professionCode);
        var competencies = this.filterModel.getCompetencies(this.professionCode);
        var currentCompetency = this.filterModel.getCompetency(this.professionCode, this.competencyCode) || competencies[0];
        var competencyIndex = this.filterModel.getCompetencyIndex(this.professionCode, this.competencyCode) || 0;
        var nextCompetency = competencyIndex < competencies.length - 1 ? competencies[competencyIndex+1] : false;
        var group = currentCompetency.group;

        var levels = [];
        var answers = this.answersModel.get(currentCompetency.code) || false;
        for (var humanIndex = 1; humanIndex <= 4; humanIndex++) {
            var answer = answers ? answers[humanIndex-1] : false;
            levels.push({
                answer: answer,
                isAnswered: answer > 0,
                text: currentCompetency['level'+humanIndex]
            });
        }

        var skills = [];
        var skillAnswersText = this.answersModel.getSkillLevelsText();
        currentCompetency.skills.forEach(function (skill, index) {
            var answer = answers ? (answers[index] || false) : false;
            var answerForSlider = answer !== false
                ? parseInt(answer).toString()
                : '0';

            skills.push({
                answer: answerForSlider,
                answerText: answer > 0
                    ? skillAnswersText[answer]
                    : skillAnswersText[0],
                isAnswered: answer > 0,
                text: skill.text,
                additionalDescription: skill.additionalDescription
            });
        });

        return {
            'profession': profession,
            'competencies': competencies,
            'competenciesCount': competencies.length,
            'currentCompetency': currentCompetency,
            'isAnswered': answers !== false,
            'nextCompetency': nextCompetency,
            'nextCompetencyLink': nextCompetency ? '/test/'+profession.code+'/'+nextCompetency.code : false,
            'resultsLink': '/results',
            'competencyIndex': competencyIndex,
            'competencyGroup': group,
            'levels': levels,
            'skills': skills
        };
    },

    renderIndexPageAfterLoad: function () {
        var useSkills = true;
        this.view.render(this.getViewModel(), useSkills);
        this.initViewEvents();
    }
};

TestController = Object.assign(Object.create(BaseController), TestController);

/**
 * @param view
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @param {string} professionCode
 * @param {string} competencyCode
 * @returns {TestController}
 */
module.exports = function (view, professionsModel, answersModel, professionCode, competencyCode) {
    var instance = Object.create(TestController);
    instance.init(view, professionsModel, answersModel, professionCode, competencyCode);

    return instance;
};