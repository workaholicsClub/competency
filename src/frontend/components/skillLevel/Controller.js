const BaseController = require('../base/Controller');

let SkillLevelController = {
    init: function (view, answersModel, competency) {
        this.view = view;
        this.answersModel = answersModel;
        this.events = [];

        this.setCurrentCompetency(competency);
    },

    initEvents: function () {
        this.events = [
            {types: ['input'], target: this.view.getAllSkillSliders(), handler: this.changeSliderDescriptionTextAndUpdateAnswer}
        ];

        this.bindEvents();
    },

    getCompetencyCode: function () {
        let competency = this.getCurrentCompetency();
        return competency.code;
    },

    /**
     * @param {Event} event
     */
    changeSliderDescriptionTextAndUpdateAnswer: function (event) {
        let sliderElement = event.currentTarget;
        let levelTexts = this.answersModel.getSkillLevelsText();
        this.view.updateSkillText(sliderElement, levelTexts);

        let answers = this.view.getLevelSkillAnswers();
        this.answersModel.set(this.getCompetencyCode(), answers);
    },

    getCurrentCompetency: function () {
        return this.currentCompetency;
    },

    setCurrentCompetency: function (competency) {
        this.currentCompetency = competency;
    },

    getViewModel: function () {
        let currentCompetency = this.getCurrentCompetency();
        let skills = this.answersModel.getAnsweredSkills(currentCompetency);

        return {
            'skills': skills
        };
    },

    renderSkills: function (rootElement) {
        if (rootElement) {
            this.view.setRootElement(rootElement);
        }

        this.view.render( this.getViewModel() );
        this.initEvents();
    }
};

SkillLevelController = Object.assign(Object.create(BaseController), SkillLevelController);

/**
 * @param view
 * @param {AnswersModel} answersModel
 * @param  competency
 * @returns {SkillLevelController}
 */
module.exports = function (view, answersModel, competency) {
    let instance = Object.create(SkillLevelController);
    instance.init(view, answersModel, competency);

    return instance;
};