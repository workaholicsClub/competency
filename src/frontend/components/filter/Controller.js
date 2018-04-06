const BaseController = require('../base/Controller');
const deepClone = require('../../classes/deepClone.fn');

let FilterController = {
    /**
     * @param {FilterView} view
     * @param {FilterModel} filterModel
     * @param {AnswersModel=} answersModel
     * @param {FieldData[]} [fieldsData=[]] fieldsData
     * @param {SkillLevelController} skillLevelController
     */
    init: function (view, filterModel, answersModel, fieldsData, skillLevelController) {
        this.view = view;
        this.filterModel = filterModel;
        this.answersModel = answersModel;
        this.skillLevelController = skillLevelController;
        this.element = view.getRootElement();
        this.events = [];

        this.setFieldsData(fieldsData);
    },

    setFieldsData: function (fieldsData) {
        this.fieldsData = fieldsData || {};
    },

    getFieldsData: function () {
        return this.fieldsData;
    },

    /**
     * @param {string} fieldCode
     * @returns {FieldData|boolean}
     */
    getFieldData: function (fieldCode) {
        let foundFieldData = this.fieldsData.reduce(function (result, currentField) {
            if (currentField.code === fieldCode) {
                return currentField;
            }

            return result;
        }, false);

        return foundFieldData;
    },

    getCompetency: function (fieldCode, competencyCode) {
        let fieldData = this.getFieldData(fieldCode);

        let wrongField = fieldData === false || fieldData.type !== 'competency';
        if (wrongField) {
            return false;
        }

        let foundCompetency = fieldData.variants.reduce(function (result, currentCompetency) {
            if (currentCompetency.code === competencyCode) {
                return currentCompetency;
            }

            return result;
        }, false);

        return foundCompetency;
    },

    initEvents: function () {
        this.events = [
            {types: ['change'], target: this.view.getAllCompetencyFieldSelectors(), handler: this.addSkill},
            {types: ['click'], target: this.view.getAllSkillsRemoveButtons(), handler: this.removeSkill},
            {types: ['click'], target: this.view.getAllSkillLevelTriggers(), handler: this.showSkillModal},
            {types: ['change'], target: this.view.getAllFields(), handler: this.updateFilterData},
            {types: ['change'], target: this.answersModel, handler: this.updateSkillLevels},
            {types: ['change'], target: this.filterModel, handler: this.logFilterChange}
        ];

        this.bindEvents();
    },

    logFilterChange: function () {
        console.log(this.filterModel.getProps());
    },

    updateSkillLevels: function () {
        let fieldsData = this.getViewModel();
        this.view.updateAllCompetencyRatings(fieldsData);
        this.updateShowSkillModalEvent();
    },

    addSkillRemoveEvent: function (removeButton) {
        let eventData = {types: ['click'], target: removeButton, handler: this.removeSkill};
        this.events.push(eventData);
        this.bindEvents([ eventData ]);
    },

    updateShowSkillModalEvent: function () {
        let showModalEventIndex = 2;

        let newEventData = {types: ['click'], target: this.view.getAllSkillLevelTriggers(), handler: this.showSkillModal};
        this.replaceEvent(showModalEventIndex, newEventData);
    },

    /**
     * @param {Event} event
     */
    showSkillModal: function (event) {
        event.preventDefault();

        let levelTrigger = event.currentTarget;
        let fieldCode = this.view.getFieldCodeByLevelTrigger(levelTrigger);
        let competencyCode = this.view.getSkillCodeByLevelTrigger(levelTrigger);
        let competency = this.getCompetency(fieldCode, competencyCode);

        let skillName = competency.name;
        let skillDOM = document.createElement('div');

        this.skillLevelController.setCurrentCompetency(competency);
        this.skillLevelController.renderSkills(skillDOM);

        this.view.showSkillModal(skillName, skillDOM);
    },

    /**
     * @param {Event} event
     */
    removeSkill: function (event) {
        event.preventDefault();

        let removeButton = event.srcElement;

        let skillCode = this.view.getSkillCodeByRemoveButton(removeButton);
        let fieldCode = this.view.getFieldCodeByRemoveButton(removeButton);

        this.view.removeSelectedCompetency(fieldCode, skillCode);

        let selectedSkills = this.view.getFieldValue(fieldCode);
        this.filterModel.set(fieldCode, selectedSkills);
    },

    /**
     * @param {Event} event
     */
    addSkill: function (event) {
        event.preventDefault();

        let selectElement = event.target;
        let fieldCode = this.view.getFieldCodeBySelect(selectElement);
        let skillCode = this.view.getSkillCodeBySelect(selectElement);
        let ratingPercent = this.getCompetencyRatingPercent(skillCode);

        this.view.moveSelectedCompetency(fieldCode, ratingPercent);

        let removeButton =this.view.getSkillRemoveButton(fieldCode, skillCode);

        this.addSkillRemoveEvent(removeButton);
        this.updateShowSkillModalEvent();
    },

    /**
     * @param {Event} event
     */
    updateFilterData: function (event) {
        let changedField = event.target;
        let code = changedField.getAttribute('data-code');
        let value = this.view.getFieldValue(code);

        this.filterModel.set(code, value);
    },

    getCompetencyRating: function (competencyCode) {
        let competencyRatings = this.answersModel.getAllRatings();
        return competencyRatings[competencyCode] || false;
    },

    getCompetencyRatingPercent: function (competencyCode) {
        let rating = this.getCompetencyRating(competencyCode);

        if (!rating) {
            return false;
        }

        let maxRating = 4;
        return Math.round(rating / maxRating * 100);
    },

    addRatingToCompetencies: function (competencies) {
        let competenciesWithRatings = competencies.map(function (competency) {
            let competencyWithRating = deepClone(competency);
            competencyWithRating['rating'] = this.getCompetencyRating(competency.code);
            competencyWithRating['ratingPercent'] = this.getCompetencyRatingPercent(competency.code);

            return competencyWithRating;
        }, this);

        return competenciesWithRatings;
    },

    getViewModel: function() {
        let viewModel = this.getFieldsData().map(function (fieldData) {
            if (fieldData.type === 'competency') {
                fieldData.variants = this.addRatingToCompetencies(fieldData.variants);
            }

            return fieldData;
        }, this);

        return viewModel;
    },

    renderFilter: function (rootElement) {
        if (rootElement) {
            this.view.setRootElement(rootElement);
        }

        let viewModel = this.getViewModel();
        this.view.render(viewModel);
        this.initEvents();
    }
};

FilterController = Object.assign(Object.create(BaseController), FilterController);

/**
 * @param {FilterView} view
 * @param {FilterModel} filterModel
 * @param {AnswersModel=} answersModel
 * @param {FieldData[]=} [fieldsData=[]] fieldsData
 * @param {SkillLevelController} skillLevelController
 * @returns {FilterController}
 */
module.exports = function (view, filterModel, answersModel, fieldsData, skillLevelController) {
    let instance = Object.create(FilterController);
    instance.init(view, filterModel, answersModel, fieldsData, skillLevelController);

    return instance;
};