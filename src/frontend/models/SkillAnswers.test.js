const BaseModel = require('./Base');
const answersFactory = require('./SkillAnswers');
const configMockFactory = require('../mocks/Config');
const storageMockFactory = require('../mocks/Storage');
const getXHRMock = require('../mocks/getXHRMock.fn');

function answersMockFactory(props, config, xhr) {
    return answersFactory(props, config, xhr, storageMockFactory());
}

test('AnswersModel.interface', function () {
    let answersModel = answersMockFactory({});

    expect(BaseModel.isPrototypeOf(answersModel)).toBeTruthy();
    expect(answersModel.addEventListener).toBeInstanceOf(Function);
    expect(answersModel.removeEventListener).toBeInstanceOf(Function);
    expect(answersModel.dispatchEvent).toBeInstanceOf(Function);
    expect(answersModel.set).toBeInstanceOf(Function);
    expect(answersModel.get).toBeInstanceOf(Function);
});

test('AnswersModel.getCompetencyRating', function () {
    let answers = answersMockFactory({});

    answers.set('competencyA', [4, 4, 3, 2]);
    answers.set('competencyB', [3, 4, 4, 2]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 0, 0, 0]);
    answers.set('competencyE', [0, 0, 0]);
    answers.set('competencyF', 'z');
    answers.set('competencyG', false);
    answers.set('competencyH', [2, 2, 2, 2, 2]);
    answers.set('competencyI', [2, 2, 2, 2, 2, 2]);
    answers.set('competencyJ', [3, 3, 3]);
    answers.set('competencyK', [3, 3]);

    expect(answers.getCompetencyRating('competencyA')).toEqual(3.25);
    expect(answers.getCompetencyRating('competencyB')).toEqual(3.25);
    expect(answers.getCompetencyRating('competencyC')).toEqual(1);
    expect(answers.getCompetencyRating('competencyD')).toEqual(0);
    expect(answers.getCompetencyRating('competencyE')).toEqual(0);
    expect(answers.getCompetencyRating('competencyF')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyG')).toBeFalsy();
    expect(answers.getCompetencyRating('competencyH')).toEqual(2);
    expect(answers.getCompetencyRating('competencyI')).toEqual(2);
    expect(answers.getCompetencyRating('competencyJ')).toEqual(3);
    expect(answers.getCompetencyRating('competencyK')).toEqual(3);
    expect(answers.getCompetencyRating('competencyZ')).toBeFalsy();
});

test('AnswersModel.getAllRatings', function () {
    let answers = answersMockFactory({});
    let expectedRatings = {
        "competencyA": 3.25,
        "competencyB": 3.25,
        "competencyC": 1,
        "competencyD": 0.5,
        "competencyE": 1.25,
        "competencyF": 0,
        "competencyG": false,
        "competencyH": false
    };

    answers.set('competencyA', [4, 4, 3, 2]);
    answers.set('competencyB', [3, 4, 4, 2]);
    answers.set('competencyC', [1, 1, 1, 1]);
    answers.set('competencyD', [0, 2, 0, 0]);
    answers.set('competencyE', [1, 2, 1, 1]);
    answers.set('competencyF', [0, 0, 0, 0]);
    answers.set('competencyG', false);
    answers.set('competencyH', []);

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