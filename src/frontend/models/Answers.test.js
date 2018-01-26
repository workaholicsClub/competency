const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const configMockFactory = require('../mocks/Config');
const getXHRMock = require('../mocks/getXHRMock.fn');
const answersMockData = require('../mocks/recommendProbability.json');

test('AnswersModel.interface', function () {
    var answersModel = answersFactory({});

    expect(BaseModel.isPrototypeOf(answersModel)).toBeTruthy();
    expect(answersModel.addEventListener).toBeInstanceOf(Function);
    expect(answersModel.removeEventListener).toBeInstanceOf(Function);
    expect(answersModel.dispatchEvent).toBeInstanceOf(Function);
    expect(answersModel.set).toBeInstanceOf(Function);
    expect(answersModel.get).toBeInstanceOf(Function);
});

test('AnswersModel.getCompetencyRating', function () {
    var answers = answersFactory({});

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
    var answers = answersFactory({});
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

test('AnswersModel.makeRequestUrl', function () {
    var answers = answersFactory({
        "competencyA": [5, 5, 4, 2],
        "competencyB": [3, 5, 5, 4]
    }, configMockFactory());

    var expectedUrl = '//test.api.url/courses/recommend?competency[competencyA]=3&competency[competencyB]=3.25';
    expect(answers.makeRequestUrl()).toEqual(expectedUrl);
});

test('AnswersModel.loadRecommendations', function () {
    var loadHandler = jest.fn();
    var errorHandler = jest.fn();
    var xhrMock = getXHRMock(JSON.stringify(answersMockData));

    xhrMock.responseType = 'load';
    var answers = answersFactory({}, configMockFactory(), xhrMock);
    answers.addEventListener('load', loadHandler);
    answers.addEventListener('loadError', errorHandler);
    answers.loadRecommendations();
    expect(loadHandler).toHaveBeenCalledTimes(1);

    xhrMock.responseType = 'error';
    answers = answersFactory({}, configMockFactory(), xhrMock);
    answers.addEventListener('load', loadHandler);
    answers.addEventListener('loadError', errorHandler);
    answers.load();
    expect(errorHandler).toHaveBeenCalledTimes(1);
});

test('AnswersModel.getRecommendations', function () {
    var xhrMock = getXHRMock(JSON.stringify(answersMockData));
    var answers = answersFactory({}, configMockFactory(), xhrMock);
    var recommendations = answersMockData.course;

    return new Promise(function (resolve, reject) {
        answers.addEventListener('load', function () {
            try {
                expect( answers.getRecommendations() ).toEqual(recommendations);
                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        answers.loadRecommendations();
    });
});