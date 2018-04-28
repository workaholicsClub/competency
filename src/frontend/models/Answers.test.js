const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const userFactory = require('./User');
const skillCodes = require('./Answers').skillCodes;
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

function getProfessionsModel(professionCode) {
    let professionsModel = professionsFactory(professionsMockData);
    professionsModel.setProfessionCode(professionCode);

    return professionsModel;
}

function getCompetency(professionCode, competencyCode) {
    let professionsModel = getProfessionsModel(professionCode);
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
    expect(answersModel.saveUserResultsWithPause).toBeInstanceOf(Function);
    expect(answersModel.saveUserResults).toBeInstanceOf(Function);
});

test('AnswersModel skillCodes', function () {
    expect(skillCodes).toBeInstanceOf(Array);
    expect(skillCodes).toHaveLength(4);
});

test('AnswersModel.getCompetencyRating', function () {
    let answers = answersMockFactory({});

    answers.set('competencyA', [3, 3, 2, 3]);
    answers.set('competencyB', [2, 3]);
    answers.set('competencyC', [1, 1, 1, 1, 1]);
    answers.set('competencyD', [0, 0, 0, 0]);
    answers.set('competencyE', [0, 0, 0]);
    answers.set('competencyF', 'z');
    answers.set('competencyG', false);

    expect(answers.getCompetencyRating('competencyA')).toEqual(2.75);
    expect(answers.getCompetencyRating('competencyB')).toEqual(2.5);
    expect(answers.getCompetencyRating('competencyC')).toEqual(1);
    expect(answers.getCompetencyRating('competencyD')).toEqual(0);
    expect(answers.getCompetencyRating('competencyE')).toEqual(0);
    expect(answers.getCompetencyRating('competencyF')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyG')).toBeFalsy();
});

test('AnswersModel.getAllRatings', function () {
    let answers = answersMockFactory({});
    let expectedRatings = {
        "competencyA": 1.5,
        "competencyB": 1.5,
        "competencyC": 1,
        "competencyD": 0.5,
        "competencyE": 1.33,
        "competencyF": 0,
        "competencyG": false
    };

    answers.set('competencyA', [1, 2]);
    answers.set('competencyB', [0, 1, 2, 3]);
    answers.set('competencyC', [1, 1, 1, 1, 1]);
    answers.set('competencyD', [0, 2, 0, 0]);
    answers.set('competencyE', [1, 2, 1]);
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

test('AnswersModel getSkillLevelsText и getSkillLevelsCode', function () {
    let answers = answersFactory({}, configMockFactory());
    expect(answers.getSkillLevelsText()).toHaveLength(4);
    expect(answers.getSkillLevelsCode()).toHaveLength(4);
});

test('AnswersModel.getAnsweredSkills', function () {
    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let skillAnswers = [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0];
    let expectedSkills = [
        {
            id: 207,
            answer: '1',
            answerText: 'Знаю',
            answerCode: 'knowledge',
            isAnswered: true,
            text: 'Работа с Linux на уровне пользователя',
            additionalDescription: ''
        },
        {
            id: 208,
            answer: '2',
            answerText: 'Осознанно применяю',
            answerCode: 'skill',
            isAnswered: true,
            text: 'Установка и удаление программ',
            additionalDescription: ''
        },
        {
            id: 209,
            answer: '3',
            answerText: 'Применяю автоматически',
            answerCode: 'ability',
            isAnswered: true,
            text: 'Подключение к сетям',
            additionalDescription: ''
        },
        {
            id: 210,
            answer: '0',
            answerText: 'Не знаю',
            answerCode: 'none',
            isAnswered: false,
            text: 'Консоль',
            additionalDescription: ''
        },
    ];

    let expectedSkillWithDescription = {
        id: 221,
        answer: '2',
        answerText: 'Осознанно применяю',
        answerCode: 'skill',
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

test('AnswersModel saveUserResults', function () {
    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let skillAnswers = [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0];

    let xhrMock = {
        addEventListener: jest.fn(),
        open: jest.fn(),
        send: jest.fn()
    };

    let storage = storageMockFactory('answers');
    let professionsModel = getProfessionsModel(professionCode);
    let user = userFactory({});
    let answers = answersFactory({}, configMockFactory(), xhrMock, storage, professionsModel, user);
    answers.set(competencyCode, skillAnswers);

    let userId = user.getId();
    let sessionId = user.getSessionId();

    answers.saveUserResults(user, professionsModel);
    let requestType = xhrMock.open.mock.calls[0][0];
    let formData = xhrMock.send.mock.calls[0][0];

    expect(formData).toBeInstanceOf(FormData);
    expect(requestType).toEqual('POST');
    expect(formData.get('userId')).toEqual(userId);
    expect(formData.get('sessionId')).toEqual(sessionId);
    expect(formData.get('skills[207]')).toEqual('knowledge');
    expect(formData.get('skills[208]')).toEqual('skill');
    expect(formData.get('skills[209]')).toEqual('ability');
    expect(formData.get('skills[210]')).toBeNull();
    expect(formData.get('skills[221]')).toEqual('skill');
});

test('AnswersModel saveUserResultsWithPause', function () {
    let waitLoadMs = 600;
    let professionCode = 'tester';
    let competencyCode = 'operatingSystems';
    let skillAnswers = [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0];

    let xhrMock = getXHRMock('{"success": true}', null, 'http://127.0.0.1:8080/api/results/saveSession');

    let storage = storageMockFactory('answers');
    let professionsModel = getProfessionsModel(professionCode);
    let user = userFactory({});
    let answers = answersFactory({}, configMockFactory(), xhrMock, storage, professionsModel, user);
    let saveHandler = jest.fn();
    answers.set(competencyCode, skillAnswers);
    answers.addEventListener('saveSession', saveHandler);

    return new Promise(function (resolve, reject) {
        answers.saveUserResultsWithPause(user, professionsModel);
        answers.saveUserResultsWithPause(user, professionsModel);
        answers.saveUserResultsWithPause(user, professionsModel);
        answers.saveUserResultsWithPause(user, professionsModel);
        answers.saveUserResultsWithPause(user, professionsModel);

        setTimeout(function () {
            try {
                expect(saveHandler).toHaveBeenCalledTimes(1);
                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        }, waitLoadMs);
    }).then(function () {
        return new Promise(function (resolve, reject) {
            answers.saveUserResultsWithPause(user, professionsModel);

            setTimeout(function () {
                try {
                    expect(saveHandler).toHaveBeenCalledTimes(2);
                    resolve();
                }
                catch (exception) {
                    reject(exception);
                }
            }, waitLoadMs);
        });
    });
});