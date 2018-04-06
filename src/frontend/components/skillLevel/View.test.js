const h = require('hyperscript');
const testViewFactory = require('./View');
const jss = require('jss').default;
const polyfillsFactory = require('../../classes/Polyfills');

function getViewModel() {
    let skills = [{
        answer: '2',
        answerText: 'Знаю',
        isAnswered: true,
        text: "Сетевые коммуникационные протоколы",
        additionalDescription: "IPv4, IPv6, TCP, UDP, POP, IMAP, SMTP, HTTP, SMB"
    }, {
        answer: '0',
        answerText: 'Не знаю',
        isAnswered: false,
        text: "Виртуализация",
        additionalDescription: ""
    }, {
        answer: '3',
        answerText: 'Знаю',
        isAnswered: true,
        text: "Осознанно применяю",
        additionalDescription: ""
    }];
    
    return {
        skills: skills
    }
}

test('SkillLevelView.createDOM', function () {
    let DOMelement = document.createElement('div');
    let view = testViewFactory(DOMelement, jss);
    let viewModel = getViewModel();

    let indexViewDOM = view.createDOM(viewModel);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('SkillLevelView getRootElement setRootElement', function () {
    let DOMelement = document.createElement('div');
    let DOMelement2 = document.createElement('span');

    let view = testViewFactory(DOMelement, jss);
    expect(view.getRootElement()).toEqual(DOMelement);

    view.setRootElement(DOMelement2);
    expect(view.getRootElement()).toEqual(DOMelement2);
});

test('SkillLevelView.render', function () {
    let DOMelement = document.createElement('div');
    let view = testViewFactory(DOMelement, jss);

    view.render(getViewModel());
    expect(view.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});

test('SkillLevelView getAllSkillSliders, getLevelSkillAnswers', function () {
    let DOMelement = document.createElement('div');
    let view = testViewFactory(DOMelement, jss);
    view.render(getViewModel());

    let skillSliders = view.getAllSkillSliders();

    expect( skillSliders ).toBeInstanceOf(NodeList);
    expect( skillSliders ).toHaveLength(3);
    expect( skillSliders[0] ).toBeInstanceOf(HTMLInputElement);

    let expectedAnswers = [2, 0, 3];
    let answers = view.getLevelSkillAnswers();
    expect(answers).toEqual(expectedAnswers);
});

test('SkillLevelView.updateSkillText', function () {
    let levelTexts = [
        'Не знаю',
        'Знаю',
        'Осознанно применяю',
        'Применяю автоматически'
    ];

    let sliderValue = 2;
    let expectedText = 'Осознанно применяю';

    /**
     * @type {HTMLElement} DOM
     */
    let DOM = h('table',
        h('tr',
            h('td',
                h('input', {type: 'range', attrs: {value: sliderValue}})
            ),
            h('td',
                h('span', 'Не знаю')
            )
        )
    );

    let slider = DOM.querySelector('input');
    let testView = testViewFactory(DOM, jss);
    polyfillsFactory();

    let text = DOM.querySelector('span');
    expect(text.innerHTML).toEqual('Не знаю');

    testView.updateSkillText(slider, levelTexts);

    text = DOM.querySelector('span');
    expect(text.innerHTML).toEqual(expectedText);
});