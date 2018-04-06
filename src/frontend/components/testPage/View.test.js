const testViewFactory = require('./View');
const testControllerFactory = require('./Controller');
const jss = require('jss').default;
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');

function getViewModel() {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, jss);

    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let professionsModel = professionsFactory(professionsMockData);
    let answersModel = answersFactory();
    let controller = testControllerFactory(testView, professionsModel, answersModel, professionCode, competencyCode);
    return controller.getViewModel();
}

test('TestView.createDOM', function () {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, jss);
    let viewModel = getViewModel();
    let evaluationBlock = document.createElement('div');

    let indexViewDOM = testView.createDOM(viewModel, evaluationBlock);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('TestView.render', function () {
    let DOMelement = document.createElement('div');
    let testView = testViewFactory(DOMelement, jss);
    let useSkills = false;

    testView.render(getViewModel(), useSkills);
    expect(testView.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});