const testViewFactory = require('./View');
const testControllerFactory = require('./Controller');
const stylesManager = require('../../classes/stylesManager');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');

function getViewModel() {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, stylesManager);

    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let professionsModel = professionsFactory(professionsMockData);
    let answersModel = answersFactory();
    let controller = testControllerFactory(testView, professionsModel, answersModel, professionCode, competencyCode);
    return controller.getViewModel();
}

test('TestView.createDOM', function () {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, stylesManager);
    let viewModel = getViewModel();

    let indexViewDOM = testView.createDOM(viewModel);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('TestView.render', function () {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, stylesManager);
    let useSkills = false;

    testView.render(getViewModel(), useSkills);
    expect(testView.getRootElement()).toBe(DOMelement);
    expect(testView.getEvaluationContainer()).toBeInstanceOf(HTMLElement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});