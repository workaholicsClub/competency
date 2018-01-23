const testViewFactory = require('./View');
const testControllerFactory = require('./Controller');
const jss = require('jss').default;
const professionsModelFactory = require('../../models/Professions');
const professionsMockData = require('../../mocks/professions.json');

function getViewModel() {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);

    var professionCode = 'tester';
    var competencyCode = 'operatingSystems';
    var professionsModel = professionsModelFactory(professionsMockData);

    var controller = testControllerFactory(testView, professionsModel, professionCode, competencyCode);
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
