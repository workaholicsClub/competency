const filterControllerFactory = require('./Controller');
const filterViewFactory = require('./View');
const filterModelFactory = require('../../models/Filter');
const testFieldsData = require('../../mocks/filterFieldsData');

function getFilterControllerInstance(fieldsData, rootElement) {
    if (!rootElement) {
        rootElement = document.createElement('div');
    }

    let filterModel = filterModelFactory({});
    let stylesManager = {};

    let view = filterViewFactory(rootElement, stylesManager);
    let controller = filterControllerFactory(view, filterModel, fieldsData);

    return controller;
}

test('FilterController.interface', function () {
    let controller = getFilterControllerInstance();

    expect(controller.handleEvent).toBeInstanceOf(Function);
    expect(controller.bindEvents).toBeInstanceOf(Function);
    expect(controller.renderFilter).toBeInstanceOf(Function);
});

test('FilterController get/set fields data', function () {
    let controller = getFilterControllerInstance(testFieldsData);
    expect(controller.getFieldsData()).toEqual(testFieldsData);

    controller = getFilterControllerInstance();
    expect(controller.getFieldsData()).toEqual({});
    controller.setFieldsData(testFieldsData);
    expect(controller.getFieldsData()).toEqual(testFieldsData);
});