const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const configMockFactory = require('../mocks/Config');
const storageMockFactory = require('../mocks/Storage');
const getXHRMock = require('../mocks/getXHRMock.fn');

function answersMockFactory(props, config, xhr) {
    return answersFactory(props, config, xhr, storageMockFactory());
}

test('AnswersModel.interface', function () {
    var answersModel = answersMockFactory({});

    expect(BaseModel.isPrototypeOf(answersModel)).toBeTruthy();
    expect(answersModel.addEventListener).toBeInstanceOf(Function);
    expect(answersModel.removeEventListener).toBeInstanceOf(Function);
    expect(answersModel.dispatchEvent).toBeInstanceOf(Function);
    expect(answersModel.set).toBeInstanceOf(Function);
    expect(answersModel.get).toBeInstanceOf(Function);
});

test('AnswersModel.getCompetencyRating', function () {
    var answers = answersMockFactory({});

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
    var answers = answersMockFactory({});
    var expectedRatings = {
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
    var storageMock = {
        init: jest.fn(),
        save: jest.fn(),
        load: jest.fn()
    };

    var answers = answersFactory({}, configMockFactory(), false, storageMock);

    expect(storageMock.load).toHaveBeenCalledTimes(1);
    expect(storageMock.save).not.toHaveBeenCalled();

    answers.set('test', 1);
    expect(storageMock.save).toHaveBeenCalledTimes(1);
});

test('AnswersModel.saveResults', function () {
    var xhrMock = getXHRMock(JSON.stringify({status: 200, success: true}));
    var answers = answersFactory({}, configMockFactory(), xhrMock);

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