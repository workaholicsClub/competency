const BaseController = require('../base/Controller');

let FilterController = {
    init: function (view, filterModel, fieldsData) {
        this.view = view;
        this.professionsModel = filterModel;
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
            {types: ['change'], target: this.view.getAllFields(), handler: this.updateFilterData}
        ];

        this.bindEvents();
    },

    /**
     * @param {Event} event
     */
    updateFilterData: function (event) {
        let changedField = event.target;
        let code = changedField.getAttribute('data-code');
        let value = this.view.getFieldValue(code);

        this.professionsModel.set(code, value);
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