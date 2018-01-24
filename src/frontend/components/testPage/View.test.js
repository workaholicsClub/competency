const testViewFactory = require('./View');
const testControllerFactory = require('./Controller');
const jss = require('jss').default;
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');

function getViewModel() {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);

    var professionCode = 'tester';
    var competencyCode = 'operatingSystems';
    var professionsModel = professionsFactory(professionsMockData);
    var answersModel = answersFactory();
    var controller = testControllerFactory(testView, professionsModel, answersModel, professionCode, competencyCode);
    return controller.getViewModel();
}

test('TestView.createDOM', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);
    var indexViewDOM = testView.createDOM(getViewModel());
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('TestView.render', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);

    testView.render(getViewModel());
    expect(testView.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});

test('TestView.getLevelSelects и getLevelAnswers', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);
    testView.render(getViewModel());

    var levelSelects = testView.getAllLevelSelects();
    for (var levelIndex = 1; levelIndex <= 4; levelIndex++) {
        expect( testView.getLevelSelect(levelIndex) ).toBeInstanceOf(HTMLSelectElement);
    }
    expect( testView.getLevelSelect(5) ).toBeNull();
    expect( levelSelects ).toBeInstanceOf(NodeList);
    expect( levelSelects ).toHaveLength(4);

    var answers = testView.getLevelAnswers();
    expect(answers).toEqual([0, 0, 0, 0]);
});