const filterControllerFactory = require('./Controller');
const filterViewFactory = require('./View');
const filterModelFactory = require('../../models/Filter');
const answersModelFactory = require('../../models/Answers');
const getTestFieldsData = require('../../mocks/filterFieldsData');

const skillControllerFactory = require('../skillLevel/Controller');
const skillViewFactory = require('../skillLevel/View');

const jss = require('jss');
const jsspreset = require('jss-preset-default').default;
const polyfillsFactory = require('../../classes/Polyfills');

function getStylesManager() {
    return jss.create(jsspreset());
}

function getFilterView(rootElement) {
    if (!rootElement) {
        rootElement = document.createElement('div');
    }

    let stylesManager = getStylesManager();

    return filterViewFactory(rootElement, stylesManager);
}

function getFilterControllerInstance(fieldsData, view, answers) {
    if (!view) {
        view = getFilterView();
    }

    if (!answers) {
        answers = {'functionalProgramming': [5, 5, 5, 5]};
    }

    let filterModel = filterModelFactory({});
    let answersModel = answersModelFactory(answers);

    let competency = undefined;
    let skillView = skillViewFactory(undefined, getStylesManager());
    let skillController = skillControllerFactory(skillView, answersModel, competency);

    let controller = filterControllerFactory(view, filterModel, answersModel, fieldsData, skillController);

    return controller;
}

test('FilterController.interface', function () {
    let controller = getFilterControllerInstance();

    expect(controller.handleEvent).toBeInstanceOf(Function);
    expect(controller.bindEvents).toBeInstanceOf(Function);
    expect(controller.renderFilter).toBeInstanceOf(Function);
});

test('FilterController get/set fields data', function () {
    let controller = getFilterControllerInstance(getTestFieldsData());
    expect(controller.getFieldsData()).toEqual(getTestFieldsData());

    controller = getFilterControllerInstance();
    expect(controller.getFieldsData()).toEqual({});
    controller.setFieldsData(getTestFieldsData());
    expect(controller.getFieldsData()).toEqual(getTestFieldsData());
});

test('FilterController getFieldData, getCompetency', function () {
    let testFieldCode = 'dateStart';
    let unexistentFieldCode = 'noSuchField';
    let testCompetencyFieldCode = 'requiredCompetencies';
    let testCompetencyCode = 'oopProgramming';
    let unexistentCompetencyCode = 'noSuchCompetency';

    let controller = getFilterControllerInstance(getTestFieldsData());
    let fieldData = controller.getFieldData(testFieldCode);
    let noFieldFound = controller.getFieldData(unexistentFieldCode);
    let competency = controller.getCompetency(testCompetencyFieldCode, testCompetencyCode);
    let noFieldCompetency = controller.getCompetency(unexistentFieldCode, testCompetencyCode);
    let notCompetencyFieldCompetency = controller.getCompetency(testFieldCode, testCompetencyCode);
    let noCompetency = controller.getCompetency(testCompetencyCode, unexistentCompetencyCode);

    expect(fieldData.code).toEqual(testFieldCode);
    expect(fieldData.label).toEqual('Дата начала');
    expect(noFieldFound).toBeFalsy();

    expect(competency.code).toEqual(testCompetencyCode);
    expect(competency.name).toEqual('ОО программирование и проектирование');
    expect(noFieldCompetency).toBeFalsy();
    expect(notCompetencyFieldCompetency).toBeFalsy();
    expect(noCompetency).toBeFalsy();
});

test('FilterController getViewModel', function () {
    let controller = getFilterControllerInstance(getTestFieldsData());
    let viewModel = controller.getViewModel();

    let testCompetency = viewModel[1];
    let testVariant = testCompetency.variants[0];

    expect(testVariant).toHaveProperty('id');
    expect(testVariant).toHaveProperty('code');
    expect(testVariant).toHaveProperty('name');
    expect(testVariant).toHaveProperty('rating');
    expect(testVariant).toHaveProperty('ratingPercent');

    expect(testVariant.code).toEqual('functionalProgramming');
    expect(testVariant.name).toEqual('Функциональное программирование');
    expect(testVariant.rating).toEqual(4);
    expect(testVariant.ratingPercent).toEqual(100);
});

test('FilterController addRatingToCompetencies', function () {
    let testFields = getTestFieldsData();
    let view = getFilterView();
    let competencies = testFields[1].variants;

    let answers = {'functionalProgramming': [5, 5, 5, 5]};
    let controller = getFilterControllerInstance(testFields, view, answers);

    let competenciesWithRatings = controller.addRatingToCompetencies(competencies);

    expect(competencies[0]).not.toHaveProperty('rating');
    expect(competencies[0]).not.toHaveProperty('ratingPercent');
    expect(competencies[1]).not.toHaveProperty('rating');
    expect(competencies[1]).not.toHaveProperty('ratingPercent');

    expect(competenciesWithRatings[0]).toHaveProperty('rating');
    expect(competenciesWithRatings[0]).toHaveProperty('ratingPercent');
    expect(competenciesWithRatings[1]).toHaveProperty('rating');
    expect(competenciesWithRatings[1]).toHaveProperty('ratingPercent');

    expect(competencies[0].code).toEqual(competenciesWithRatings[0].code);
    expect(competencies[0].name).toEqual(competenciesWithRatings[0].name);
    expect(competencies[0].skills).toEqual(competenciesWithRatings[0].skills);
    expect(competenciesWithRatings[0].rating).toEqual(4);
    expect(competenciesWithRatings[0].ratingPercent).toEqual(100);

    expect(competencies[1].code).toEqual(competenciesWithRatings[1].code);
    expect(competencies[1].name).toEqual(competenciesWithRatings[1].name);
    expect(competencies[1].skills).toEqual(competenciesWithRatings[1].skills);
    expect(competenciesWithRatings[1].rating).toBeFalsy();
    expect(competenciesWithRatings[1].ratingPercent).toBeFalsy();
});

test('FilterController showSkillModal', function () {
    polyfillsFactory();

    let controller = getFilterControllerInstance(getTestFieldsData(['oopProgramming']));

    let filterContainer = document.createElement('div');
    controller.renderFilter(filterContainer);
    expect(filterContainer.firstChild).toBeInstanceOf(HTMLElement);

    let skillModal = filterContainer.querySelector('#skillModal');

    return new Promise(function (resolve, reject) {
        skillModal.addEventListener('shown.bs.modal', function() {

            let isModalShown = skillModal.getAttribute('aria-hidden') === 'false';
            let modalTitle = skillModal.querySelector('.modal-title').textContent;
            let skillLevel = skillModal.querySelector('.skillContainer input');

            try {
                expect(isModalShown).toBeTruthy();
                expect(modalTitle).toEqual('ОО программирование и проектирование');
                expect(skillLevel).toBeInstanceOf(HTMLElement);

                resolve();
            }
            catch (exception) {
                reject(exception);
            }

        });

        let levelTrigger = filterContainer.querySelector('.levelTrigger');
        let clickEvent = new Event('click');
        levelTrigger.dispatchEvent(clickEvent);
    });
});

test('FilterController updateSkillLevels', function () {
    polyfillsFactory();

    let controller = getFilterControllerInstance(getTestFieldsData(['oopProgramming']));

    let filterContainer = document.createElement('div');
    controller.renderFilter(filterContainer);
    expect(filterContainer.firstChild).toBeInstanceOf(HTMLElement);

    let skillModal = filterContainer.querySelector('#skillModal');

    return new Promise(function (resolve, reject) {
        skillModal.addEventListener('shown.bs.modal', function() {

            let skillInput = skillModal.querySelector('.skillContainer input');
            let skillLevelTextBefore = filterContainer.querySelector('.selectedItem .levelText').textContent;

            skillInput.value = '4';
            let changeEvent = new Event('input');
            skillInput.dispatchEvent(changeEvent);
            let skillLevelTextAfter = filterContainer.querySelector('.selectedItem .levelText').textContent;

            try {
                expect(skillLevelTextBefore).toEqual('-');
                expect(skillLevelTextAfter).toEqual('19%');
            }
            catch (exception) {
                reject(exception);
            }

            resolve();
        });

        let levelTrigger = filterContainer.querySelector('.levelTrigger');
        let clickEvent = new Event('click');
        levelTrigger.dispatchEvent(clickEvent);
    });
});