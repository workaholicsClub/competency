const h = require('hyperscript');
const testViewFactory = require('./View');
const testControllerFactory = require('./Controller');
const jss = require('jss').default;
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');
const polyfillsFactory = require('../../classes/Polyfills');

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
    var viewModel = getViewModel();
    var evaluationMechanism = testView.createLevels(viewModel);

    var indexViewDOM = testView.createDOM(viewModel, evaluationMechanism);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('TestView.render', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);
    var useSkills = false;

    testView.render(getViewModel(), useSkills);
    expect(testView.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});

test('TestView.getLevelSelects и getLevelAnswers', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);
    var useSkills = false;
    testView.render(getViewModel(), useSkills);

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

test('TestView.getAllSkillSliders', function () {
    var DOMelement = document.createElement('div');
    var testView = testViewFactory(DOMelement, jss);
    var useSkills = true;
    testView.render(getViewModel(), useSkills);

    var skillSliders = testView.getAllSkillSliders();

    expect( skillSliders ).toBeInstanceOf(NodeList);
    expect( skillSliders ).toHaveLength(22);
    expect( skillSliders[0] ).toBeInstanceOf(HTMLInputElement);

    var expectedAnswers = Array(22).fill(0);
    var answers = testView.getLevelSkillAnswers();
    expect(answers).toEqual(expectedAnswers);
});

test('TestView.markLevelCompleted', function () {
    /**
     * @type {HTMLElement} DOM
     */
    var DOM = h('div',
            h('div.card',
                h('select.test')
            )
        );

    var select = DOM.querySelector('select');
    var testView = testViewFactory(DOM, jss);
    polyfillsFactory();
    testView.markLevelCompleted(select);

    var card = DOM.querySelector('.card');
    expect(card.getAttribute('class')).toEqual('card bg-success text-white');
});

test('TestView.updateSkillText', function () {
    var levelTexts = [
        'Не знаю',
        'Ознакомлен',
        'Действую повторением',
        'Действую на автомате, отношусь критически',
        'Использую в творческой деятельности'
    ];

    var sliderValue = 2;
    var expectedText = 'Действую повторением';

    /**
     * @type {HTMLElement} DOM
     */
    var DOM = h('table',
        h('tr',
            h('td',
                h('input', {type: 'range', attrs: {value: sliderValue}})
            ),
            h('td',
                h('span', 'Не знаю')
            )
        )
    );

    var slider = DOM.querySelector('input');
    var testView = testViewFactory(DOM, jss);
    polyfillsFactory();

    var text = DOM.querySelector('span');
    expect(text.innerHTML).toEqual('Не знаю');

    testView.updateSkillText(slider, levelTexts);

    text = DOM.querySelector('span');
    expect(text.innerHTML).toEqual(expectedText);
});