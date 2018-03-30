const BaseController = require('../base/Controller');

let FilterController = {
    init: function (view, filterModel, fieldsData) {
        this.view = view;
        this.filterModel = filterModel;
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

    initEvents: function () {
        this.events = [
            {types: ['change'], target: this.view.getAllCompetencyFieldSelectors(), handler: this.addSkill},
            {types: ['click'], target: this.view.getAllSkillsRemoveButtons(), handler: this.removeSkill},
            {types: ['change'], target: this.view.getAllFields(), handler: this.updateFilterData},
            {types: ['change'], target: this.filterModel, handler: this.logFilterChange}
        ];

        this.bindEvents();
    },

    logFilterChange: function () {
        console.log(this.filterModel.getProps());
    },

    addSkillRemoveEvent: function (removeButton) {
        let eventData = {types: ['click'], target: removeButton, handler: this.removeSkill};
        this.events.push(eventData);
        this.bindEvents([ eventData ]);
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

        this.view.moveSelectedCompetency(fieldCode);

        let removeButton =this.view.getSkillRemoveButton(fieldCode, skillCode);
        this.addSkillRemoveEvent(removeButton);
    },

    /**
     * @param {Event} event
     */
    updateFilterData: function (event) {
        let changedField = event.target;
        let code = changedField.getAttribute('data-code');
        let value = this.view.getFieldValue(code);

        this.filterModel.set(code, value);
        console.log(this.filterModel.getProps());
    },

    renderFilter: function (rootElement) {
        if (rootElement) {
            this.view.setRootElement(rootElement);
        }

        let viewModel = this.fieldsData;
        this.view.render(viewModel);
        this.initEvents();
    }
};

FilterController = Object.assign(Object.create(BaseController), FilterController);

/**
 * @param view
 * @param filterModel
 * @param {FieldData[]} fieldsData
 * @returns {FilterController}
 */
module.exports = function (view, filterModel, fieldsData) {
    let instance = Object.create(FilterController);
    instance.init(view, filterModel, fieldsData);

    return instance;
};