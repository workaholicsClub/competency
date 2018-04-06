const BaseController = require('../base/Controller');

let TestController = {
    init: function (view, professionsModel, answersModel, professionCode, competencyCode, skillLevelController) {
        this.view = view;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.skillLevelController = skillLevelController;
        this.element = view.getRootElement();
        this.events = [];

        this.setProfessionCode(professionCode);
        this.setCompetencyCode(competencyCode);
    },

    setProfessionCode: function (professionCode) {
        this.professionCode = professionCode;
    },

    setCompetencyCode: function (competencyCode) {
        this.competencyCode = competencyCode;
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
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

    getCompetencyCode: function () {
        let competencyCode = this.competencyCode;
        if (!competencyCode) {
            let competencies = this.professionsModel.getCompetencies(this.professionCode);
            let firstCompetency = competencies[0];
            competencyCode = firstCompetency ? firstCompetency.code : false;
        }

        return competencyCode;
    },

    changeSliderDescriptionTextAndUpdateAnswer: function (event) {
        let sliderElement = event.currentTarget;
        let levelTexts = this.answersModel.getSkillLevelsText();
        this.view.updateSkillText(sliderElement, levelTexts);

        let answers = this.view.getLevelSkillAnswers();
        this.answersModel.set(this.getCompetencyCode(), answers);
    },

    /**
     * @param {Event} event
     */
    markLevelCompletedAndUpdateAnswer: function (event) {
        let selectElement = event.currentTarget;
        this.view.markLevelCompleted(selectElement);

        let answers = this.view.getLevelAnswers();
        this.answersModel.set(this.getCompetencyCode(), answers);
    },

    getViewSkills: function (currentCompetency) {
        let skills = [];
        let skillAnswersText = this.answersModel.getSkillLevelsText();
        let answers = this.answersModel.get(currentCompetency.code) || false;

        currentCompetency.skills.forEach(function (skill, index) {
            let answer = answers ? (answers[index] || false) : false;
            let answerForSlider = answer !== false
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

        return skills;
    },

    getCurrentCompetency: function () {
        let competencies = this.professionsModel.getCompetencies(this.professionCode);
        return this.professionsModel.getCompetency(this.professionCode, this.competencyCode) || competencies[0];
    },

    getViewModel: function () {
        let profession = this.professionsModel.getProfession(this.professionCode);
        let competencies = this.professionsModel.getCompetencies(this.professionCode);
        let currentCompetency = this.getCurrentCompetency();
        let competencyIndex = this.professionsModel.getCompetencyIndex(this.professionCode, this.competencyCode) || 0;
        let nextCompetency = competencyIndex < competencies.length - 1 ? competencies[competencyIndex+1] : false;
        let group = currentCompetency.group;

        let levels = [];
        let answers = this.answersModel.get(currentCompetency.code) || false;
        for (let humanIndex = 1; humanIndex <= 4; humanIndex++) {
            let answer = answers ? answers[humanIndex-1] : false;
            levels.push({
                answer: answer,
                isAnswered: answer > 0,
                text: currentCompetency['level'+humanIndex]
            });
        }

        let skills = this.getViewSkills(currentCompetency);

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
        let rootElement = document.createElement('div');
        this.skillLevelController.setCurrentCompetency( this.getCurrentCompetency() );
        this.skillLevelController.renderSkills(rootElement);

        let evaluationBlock = rootElement.firstChild;

        this.view.render(this.getViewModel(), evaluationBlock);
    }

};

TestController = Object.assign(Object.create(BaseController), TestController);

/**
 * @param view
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @param {string} professionCode
 * @param {string} competencyCode
 * @param {SkillLevelController} skillLevelController
 * @returns {TestController}
 */
module.exports = function (view, professionsModel, answersModel, professionCode, competencyCode, skillLevelController) {
    let instance = Object.create(TestController);
    instance.init(view, professionsModel, answersModel, professionCode, competencyCode, skillLevelController);

    return instance;
};