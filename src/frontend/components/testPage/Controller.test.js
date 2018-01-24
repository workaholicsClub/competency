const testControllerFactory = require('./Controller');
const testPageViewFactory = require('./View');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');

function getViewInstance() {
    var rootElement = document.createElement('div');
    var stylesManager = {};

    return testPageViewFactory(rootElement, stylesManager);
}

function getControllerInstance(professionCode, competencyCode) {
    var view = getViewInstance();
    var professionsModel = professionsFactory(professionsMockData);
    var answersModel = answersFactory();
    return testControllerFactory(view, professionsModel, answersModel, professionCode, competencyCode);
}

test('TestController.interface', function () {
    var testController = getControllerInstance();

    expect(testController.handleEvent).toBeInstanceOf(Function);
    expect(testController.bindEvents).toBeInstanceOf(Function);
});

test('TestController.codes', function () {
    var expectedProfessionCode = 'tester';
    var expectedCompetencyCode = 'operatingSystems';

    var testController = getControllerInstance(expectedProfessionCode, expectedCompetencyCode);
    expect(testController).toHaveProperty('professionCode');
    expect(testController).toHaveProperty('competencyCode');
    expect(testController.professionCode).toEqual(expectedProfessionCode);
    expect(testController.competencyCode).toEqual(expectedCompetencyCode);
});

test('TestController.getViewModel', function () {
    var expectedProfessionCode = 'tester';
    var expectedCompetencyCode = 'operatingSystems';
    var expectedNextCompetencyCode = 'probabiltyBasics';
    var expectedGroupCode = 'environment';
    var expectedLink = '/test/'+expectedProfessionCode+'/'+expectedNextCompetencyCode;
    var expectedCompetenciesCount = 6;
    var expectedCompetencyIndex = 2;
    var expectedLevelsCount = 4;

    var testController = getControllerInstance(expectedProfessionCode, expectedCompetencyCode);
    var viewModel = testController.getViewModel();

    expect(viewModel).toHaveProperty('profession');
    expect(viewModel).toHaveProperty('competencies');
    expect(viewModel).toHaveProperty('competenciesCount');
    expect(viewModel).toHaveProperty('currentCompetency');
    expect(viewModel).toHaveProperty('nextCompetency');
    expect(viewModel).toHaveProperty('nextCompetencyLink');
    expect(viewModel).toHaveProperty('competencyIndex');
    expect(viewModel).toHaveProperty('competencyGroup');
    expect(viewModel).toHaveProperty('levels');

    expect(viewModel.profession.code).toEqual(expectedProfessionCode);
    expect(viewModel.competencies).toHaveLength(expectedCompetenciesCount);
    expect(viewModel.competenciesCount).toEqual(expectedCompetenciesCount);
    expect(viewModel.currentCompetency.code).toEqual(expectedCompetencyCode);
    expect(viewModel.nextCompetency.code).toEqual(expectedNextCompetencyCode);
    expect(viewModel.nextCompetencyLink).toEqual(expectedLink);
    expect(viewModel.competencyIndex).toEqual(expectedCompetencyIndex);
    expect(viewModel.competencyGroup.code).toEqual(expectedGroupCode);
    expect(viewModel.levels).toHaveLength(expectedLevelsCount);
});