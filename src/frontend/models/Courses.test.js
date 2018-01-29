const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const coursesFactory = require('./Courses');
const configMockFactory = require('../mocks/Config');
const getXHRMock = require('../mocks/getXHRMock.fn');
const recommendMockData = require('../mocks/recommendProbability.json');

test('CoursesModel.interface', function () {
    var coursesModel = coursesFactory({});

    expect(BaseModel.isPrototypeOf(coursesModel)).toBeTruthy();
    expect(coursesModel.addEventListener).toBeInstanceOf(Function);
    expect(coursesModel.removeEventListener).toBeInstanceOf(Function);
    expect(coursesModel.dispatchEvent).toBeInstanceOf(Function);
    expect(coursesModel.set).toBeInstanceOf(Function);
    expect(coursesModel.get).toBeInstanceOf(Function);
});

test('CoursesMode.setRatings и getRatings', function () {
    var ratings = {
        competencyA: 3,
        competencyB: 3.25
    };

    var courses = coursesFactory({});
    courses.setRatings(ratings);
    expect(courses.getRatings()).toEqual(ratings);
});

test('CoursesModel.makeRequestUrl', function () {
    var answers = answersFactory({
        "competencyA": [5, 5, 4, 2],
        "competencyB": [3, 5, 5, 4]
    }, configMockFactory());

    var courses = coursesFactory({}, configMockFactory());
    courses.setRatings(answers.getAllRatings());

    var expectedUrl = '//test.api.url/courses/recommend?competency[competencyA]=3&competency[competencyB]=3.25';
    expect(courses.makeRequestUrl()).toEqual(expectedUrl);
});

test('CoursesModel.loadRecommendations', function () {
    var loadHandler = jest.fn();
    var errorHandler = jest.fn();
    var xhrMock = getXHRMock(JSON.stringify(recommendMockData));

    xhrMock.responseType = 'load';
    var courses = coursesFactory({}, configMockFactory(), xhrMock);
    courses.addEventListener('load', loadHandler);
    courses.addEventListener('loadError', errorHandler);
    courses.loadRecommendations();
    expect(loadHandler).toHaveBeenCalledTimes(1);

    xhrMock.responseType = 'error';
    courses = coursesFactory({}, configMockFactory(), xhrMock);
    courses.addEventListener('load', loadHandler);
    courses.addEventListener('loadError', errorHandler);
    courses.load();
    expect(errorHandler).toHaveBeenCalledTimes(1);
});

test('CoursesModel.getRecommendations', function () {
    var xhrMock = getXHRMock(JSON.stringify(recommendMockData));
    var courses = coursesFactory({}, configMockFactory(), xhrMock);
    var recommendations = recommendMockData.course;

    return new Promise(function (resolve, reject) {
        courses.addEventListener('load', function () {
            try {
                expect( courses.getRecommendations() ).toEqual(recommendations);
                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        courses.loadRecommendations();
    });
});
