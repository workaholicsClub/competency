const skillLevelControllerFactory = require('./Controller');
const skillLevelViewFactory = require('./View');
const answersFactory = require('../../models/Answers');
const professionsFactory = require('../../models/Professions');
const professionsMockData = require('../../mocks/professions.json');
const polyfillsFactory = require('../../classes/Polyfills');

function getViewInstance() {
    let rootElement = document.createElement('div');
    let stylesManager = {};

    return skillLevelViewFactory(rootElement, stylesManager);
}

function getCompetency(professionCode, competencyCode) {
    let professionsModel = professionsFactory(professionsMockData);
    return professionsModel.getCompetency(professionCode, competencyCode);
}

function getControllerInstance(view, answersModel, competency) {
    if (!view) {
        view = getViewInstance();
    }

    if (!answersModel) {
        answersModel = answersFactory();
    }

    if (!competency) {
        let professionCode = 'tester';
        let competencyCode = 'operatingSystems';
        competency = getCompetency(professionCode, competencyCode);
    }

    return skillLevelControllerFactory(view, answersModel, competency);
}

test('SkillLevelController.interface', function () {
    let controller = getControllerInstance();

    expect(controller.handleEvent).toBeInstanceOf(Function);
    expect(controller.bindEvents).toBeInstanceOf(Function);
});

test('SkillLevelController.getViewModel', function () {
    let expectedSkillsCount = 23;
    let testController = getControllerInstance();
    let viewModel = testController.getViewModel();

    expect(viewModel).toHaveProperty('skills');
    expect(viewModel.skills).toHaveLength(expectedSkillsCount);
    expect(viewModel.skills[0]).toHaveProperty('answer');
    expect(viewModel.skills[0]).toHaveProperty('answerText');
    expect(viewModel.skills[0]).toHaveProperty('isAnswered');
    expect(viewModel.skills[0]).toHaveProperty('text');
    expect(viewModel.skills[0]).toHaveProperty('additionalDescription');
});

test('SkillLevelController skills render and change', function () {
    polyfillsFactory();

    let competencyCode = 'operatingSystems';
    let view = getViewInstance();
    let rootElement = view.getRootElement();
    let answersModel = answersFactory();
    let skillLevels = answersModel.getSkillLevelsText();

    let skillController = getControllerInstance(view, answersModel);
    skillController.renderSkills();

    let skillSlider = view.getAllSkillSliders()[0];
    let skillElement = rootElement.querySelector('#skill0');
    let skillLabel = skillElement.querySelector('.skillName');
    let skillLevel = skillElement.querySelector('.skillAnswer');

    expect(skillSlider).toBeInstanceOf(HTMLInputElement);
    expect(skillLabel).toBeInstanceOf(HTMLElement);
    expect(skillLabel.textContent).toContain('Работа с Linux на уровне пользователя');
    expect(skillLevel.textContent).toContain(skillLevels[0]);

    let expectedSkillValue = 1;
    let changeEvent = new Event('input');
    skillSlider.value = expectedSkillValue;
    skillSlider.dispatchEvent(changeEvent);

    let expectedAnswers = [expectedSkillValue, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(skillLevel.textContent).toContain(skillLevels[expectedSkillValue]);
    expect(answersModel.get(competencyCode)).toEqual(expectedAnswers);
});