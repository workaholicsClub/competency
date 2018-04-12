const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const configMockFactory = require('../mocks/Config');
const storageMockFactory = require('../mocks/Storage');
const getXHRMock = require('../mocks/getXHRMock.fn');

const professionsFactory = require('./Professions');
const professionsMockData = require('../mocks/professions.json');

function answersMockFactory(props, config, xhr, storage, autoload) {
    if (!storage) {
        storage = storageMockFactory();
    }

    return answersFactory(props, config, xhr, storage, autoload);
}

function getCompetency(professionCode, competencyCode) {
    let professionsModel = professionsFactory(professionsMockData);
    return professionsModel.getCompetency(professionCode, competencyCode);
}

test('AnswersModel.interface', function () {
    let answersModel = answersMockFactory({});

    expect(BaseModel.isPrototypeOf(answersModel)).toBeTruthy();
    expect(answersModel.addEventListener).toBeInstanceOf(Function);
    expect(answersModel.removeEventListener).toBeInstanceOf(Function);
    expect(answersModel.dispatchEvent).toBeInstanceOf(Function);
    expect(answersModel.set).toBeInstanceOf(Function);
    expect(answersModel.get).toBeInstanceOf(Function);
    expect(answersModel.getCompetencyRating).toBeInstanceOf(Function);
    expect(answersModel.getAllRatings).toBeInstanceOf(Function);
    expect(answersModel.saveResults).toBeInstanceOf(Function);
    expect(answersModel.saveAnswers).toBeInstanceOf(Function);
    expect(answersModel.loadAnswers).toBeInstanceOf(Function);
    expect(answersModel.getSkillLevelsText).toBeInstanceOf(Function);
    expect(answersModel.getAnsweredSkills).toBeInstanceOf(Function);
});

test('AnswersModel.getCompetencyRating', function () {
    let answers = answersMockFactory({});

    answers.set('competencyA', [5, 5, 4, 2]);
    answers.set('competencyB', [3, 5, 5, 4]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 0, 0, 0]);
    answers.set('competencyE', [0, 0, 0]);
    answers.set('competencyF', 'z');
    answers.set('competencyG', false);

    expect(answers.getCompetencyRating('competencyA')).toEqual(3);
    expect(answers.getCompetencyRating('competencyB')).toEqual(3.25);
    expect(answers.getCompetencyRating('competencyC')).toEqual(0);
    expect(answers.getCompetencyRating('competencyD')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyE')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyF')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyG')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyH')).toBeFalsy();
});

test('AnswersModel.getAllRatings', function () {
    let answers = answersMockFactory({});
    let expectedRatings = {
        "competencyA": 3,
        "competencyB": 3.25,
        "competencyC": 0,
        "competencyD": 0.25,
        "competencyE": 0.25,
        "competencyF": false,
        "competencyG": false
    };

    answers.set('competencyA', [5, 5, 4, 2]);
    answers.set('competencyB', [3, 5, 5, 4]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 2, 0, 0]);
    answers.set('competencyE', [1, 2, 1, 1]);
    answers.set('competencyF', [0, 0, 0, 0]);
    answers.set('competencyG', false);

    expect(answers.getAllRatings()).toEqual(expectedRatings);
});

test('AnswersModel.changeHandler', function () {
    let storageMock = {
        init: jest.fn(),
        save: jest.fn(),
        load: jest.fn()
    };

    let answers = answersFactory({}, configMockFactory(), false, storageMock);

    expect(storageMock.load).toHaveBeenCalledTimes(1);
    expect(storageMock.save).not.toHaveBeenCalled();

    answers.set('test', 1);
    expect(storageMock.save).toHaveBeenCalledTimes(1);
});

test('AnswersModel.saveResults', function () {
    let xhrMock = getXHRMock(JSON.stringify({status: 200, success: true}));
    let answers = answersFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        answers.addEventListener('save', function () {
            try {
                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        answers.saveResults();
    });
});

test('AnswersModel.getSkillLevelsText', function () {
    let answers = answersFactory({}, configMockFactory());
    expect(answers.getSkillLevelsText()).toHaveLength(4);
});

test('AnswersModel.getAnsweredSkills', function () {
    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let skillAnswers = [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0];
    let expectedSkills = [
        {
            answer: '1',
            answerText: 'Знаю',
            isAnswered: true,
            text: 'Работа с ОС на уровне пользователя',
            additionalDescription: ''
        },
        {
            answer: '2',
            answerText: 'Осознанно применяю',
            isAnswered: true,
            text: 'Установка и удаление программ',
            additionalDescription: ''
        },
        {
            answer: '3',
            answerText: 'Применяю автоматически',
            isAnswered: true,
            text: 'Подключение к сетям',
            additionalDescription: ''
        },
        {
            answer: '0',
            answerText: 'Не знаю',
            isAnswered: false,
            text: 'Консоль',
            additionalDescription: ''
        },
    ];

    let expectedSkillWithDescription = {
        answer: '2',
        answerText: 'Осознанно применяю',
        isAnswered: true,
        text: 'Сетевые коммуникационные протоколы',
        additionalDescription: 'IPv4, IPv6, TCP, UDP, POP, IMAP, SMTP, HTTP, SMB'
    };

    let competency = getCompetency(professionCode, competencyCode);
    let answers = answersFactory({}, configMockFactory());
    answers.set(competencyCode, skillAnswers);

    let skills = answers.getAnsweredSkills(competency);
    expect(skills[0]).toEqual(expectedSkills[0]);
    expect(skills[1]).toEqual(expectedSkills[1]);
    expect(skills[2]).toEqual(expectedSkills[2]);
    expect(skills[3]).toEqual(expectedSkills[3]);
    expect(skills[14]).toEqual(expectedSkillWithDescription);
});

test('AnswersModel saveAnswers и loadAnswers', function () {
    let xhrMock = undefined;
    let storage = storageMockFactory('answers');
    let answers = answersFactory({}, configMockFactory(), xhrMock, storage);

    let expectedValue = [1, 2, 3];
    let expectedStorageData = {"test": expectedValue};
    answers.setWithoutEvent('test', expectedValue);

    expect(storage.load()).toBeFalsy();
    answers.saveAnswers();
    expect(storage.load()).toEqual(expectedStorageData);

    let autoload = false;
    answers = answersFactory({}, configMockFactory(), xhrMock, storage, autoload);
    expect(answers.get('test')).toBeNull();

    answers.loadAnswers();
    expect(answers.get('test')).toEqual(expectedValue);
});