const BaseModel = require('./Base');
const answersFactory = require('./Answers');
const filterFactory = require('./Filter');
const professionsFactory = require('./Professions');
const coursesFactory = require('./CourseCollection');
const configMockFactory = require('../mocks/Config');
const getXHRMock = require('../mocks/getXHRMock.fn');
const recommendMockData = require('../mocks/recommendProbability.json');
const searchMockData = require('../mocks/coursesSearch.json');
const professionsMockData = require('../mocks/professions.json');

test('CourseCollection.interface', function () {
    let coursesModel = coursesFactory({});

    expect(BaseModel.isPrototypeOf(coursesModel)).toBeTruthy();
    expect(coursesModel.addEventListener).toBeInstanceOf(Function);
    expect(coursesModel.removeEventListener).toBeInstanceOf(Function);
    expect(coursesModel.dispatchEvent).toBeInstanceOf(Function);
    expect(coursesModel.set).toBeInstanceOf(Function);
    expect(coursesModel.get).toBeInstanceOf(Function);
    expect(coursesModel.loadFilteredCourses).toBeInstanceOf(Function);
});

test('CoursesMode.setRatings и getRatings', function () {
    let ratings = {
        competencyA: 3,
        competencyB: 3.25
    };

    let courses = coursesFactory({});
    courses.setRatings(ratings);
    expect(courses.getRatings()).toEqual(ratings);
});

test('CourseCollection.makeRequestUrl', function () {
    let answers = answersFactory({
        "competencyA": [3, 3, 2, 1],
        "competencyB": [1, 3, 3, 2]
    }, configMockFactory());

    let courses = coursesFactory({}, configMockFactory());
    courses.setRatings(answers.getAllRatings());

    let expectedUrl = '//test.api.url/courses/recommend?competency[competencyA]=2.25&competency[competencyB]=2.25';
    expect(courses.makeRequestUrl()).toEqual(expectedUrl);
});

test('CourseCollection.loadRecommendations', function () {
    let loadHandler = jest.fn();
    let errorHandler = jest.fn();
    let xhrMock = getXHRMock(JSON.stringify(recommendMockData));

    xhrMock.responseType = 'load';
    let courses = coursesFactory({}, configMockFactory(), xhrMock);
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

test('CourseCollection.getRecommendations', function () {
    let xhrMock = getXHRMock(JSON.stringify(recommendMockData));
    let courses = coursesFactory({}, configMockFactory(), xhrMock);
    let recommendations = recommendMockData.course;

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

test('CourseCollection.getFieldData', function () {
    let courses = coursesFactory({}, configMockFactory());

    let fieldsData = [
        {code: 'userSkills', label: 'Навыки', type: 'competency', value: [], variants: []},
        {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: [], variants: []},
        {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: [], variants: []},
        {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: 1}
    ];

    let userSkillsData = courses.getFieldData('userSkills', fieldsData);
    let certificateData = courses.getFieldData('certificate', fieldsData);

    expect(userSkillsData.code).toEqual('userSkills');
    expect(certificateData.code).toEqual('certificate');
});

test('CourseCollection.getCompetencySkills', function () {
    let courses = coursesFactory({}, configMockFactory());
    let professionsModel = professionsFactory(professionsMockData);
    let professionCompetencies = professionsModel.getCompetencies('tester');

    let skills = courses.getCompetencySkills('testAutomation', professionCompetencies);
    expect(skills).toBeInstanceOf(Array);
    expect(skills).toHaveLength(16);
});

test('CourseCollection.makeFilterUrl', function () {
    let expectedUri = '//test.api.url/courses/search?modeOfStudy[]=selfStudy&courseForm[]=video&certificate=1&userSkills[354]=knowledge&userSkills[346]=skill';
    let filterModel = filterFactory({
        modeOfStudy: ['selfStudy'],
        courseForm: ['video'],
        certificate: true,
        userSkills: ["python", "testAutomation"]
    });

    let answersModel = answersFactory({
        python: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        testAutomation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0]
    });

    let professionsModel = professionsFactory(professionsMockData);
    let professionCompetencies = professionsModel.getCompetencies('tester');
    let courses = coursesFactory({}, configMockFactory());

    let fieldsData = [
        {code: 'userSkills', label: 'Навыки', type: 'competency', value: filterModel.get('userSkills'), variants: professionCompetencies},
        {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: filterModel.get('modeOfStudy'), variants: [
                {name: "Очная", code: "inPerson", info: "Аудиторные занятия с преподавателями"},
                {name: "Дистанционная", code: "longDistance", info: "Периодическое взаимодействие с преподавателями по электропочте, skype для получения образовательных материалов и задач, обсуждения их выполнения"},
                {name: "Онлайн", code: "online", info: "Работа с образовательными материалами и преподавателями в режиме онлайн"},
                {name: "Очная и онлайн", code: "inPersonOnline", info: "Совмещение аудиторных и онлайн занятий"},
                {name: "Самостоятельное обучение", code: "selfStudy", info: "Самостоятельное изучение материалов без участия преподавателя или куратора"}
            ]},
        {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: filterModel.get('courseForm'), variants: [
                {name: "Видеокурс", code: "video"},
                {name: "Текстовый курс", code: "text"},
                {name: "Интерактивный курс", code: "interactive"},
                {name: "Интенсив", code: "crashCourse"},
                {name: "Тренинг", code: "training"}
            ]},
        {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: filterModel.get('certificate')}
    ];

    let uri = courses.makeFilterUrl(filterModel, answersModel, fieldsData);
    expect(uri).toEqual(expectedUri);
});

test('CourseCollection.loadFilteredCourses', function () {
    let filterModel = filterFactory({
        modeOfStudy: ['selfStudy'],
        courseForm: ['video'],
        certificate: '1',
        userSkills: ["python", "testAutomation"]
    });

    let answersModel = answersFactory({
        python: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        testAutomation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0]
    });

    let professionsModel = professionsFactory(professionsMockData);
    let professionCompetencies = professionsModel.getCompetencies('tester');

    let fieldsData = [
        {code: 'userSkills', label: 'Навыки', type: 'competency', value: filterModel.get('userSkills'), variants: professionCompetencies},
        {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: filterModel.get('modeOfStudy'), variants: [
                {name: "Очная", code: "inPerson", info: "Аудиторные занятия с преподавателями"},
                {name: "Дистанционная", code: "longDistance", info: "Периодическое взаимодействие с преподавателями по электропочте, skype для получения образовательных материалов и задач, обсуждения их выполнения"},
                {name: "Онлайн", code: "online", info: "Работа с образовательными материалами и преподавателями в режиме онлайн"},
                {name: "Очная и онлайн", code: "inPersonOnline", info: "Совмещение аудиторных и онлайн занятий"},
                {name: "Самостоятельное обучение", code: "selfStudy", info: "Самостоятельное изучение материалов без участия преподавателя или куратора"}
            ]},
        {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: filterModel.get('courseForm'), variants: [
                {name: "Видеокурс", code: "video"},
                {name: "Текстовый курс", code: "text"},
                {name: "Интерактивный курс", code: "interactive"},
                {name: "Интенсив", code: "crashCourse"},
                {name: "Тренинг", code: "training"}
            ]},
        {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: filterModel.get('certificate')}
    ];

    let xhrMock = getXHRMock(JSON.stringify(searchMockData));
    let courses = coursesFactory({}, configMockFactory(), xhrMock);
    let expectedCourses = searchMockData.course;

    return new Promise(function (resolve, reject) {
        courses.addEventListener('load', function () {
            try {
                courses.getLoadedCourses().forEach(function (course, index) {
                    expect( course.getProps() ).toEqual(expectedCourses[index]);
                });

                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        courses.loadFilteredCourses(filterModel, answersModel, fieldsData);
    });
});

test('CourseCollection convertToCourseModelArray, convertFromCourseModelArray', function () {
    let coursesCollection = coursesFactory();
    let coursesData = searchMockData.course;

    let modelArray = coursesCollection.convertToCourseModelArray(coursesData);
    expect(modelArray).toBeInstanceOf(Array);
    expect(modelArray).toHaveLength(3);
    expect(modelArray[0].get('externalId')).toEqual('154');
    expect(modelArray[1].get('externalId')).toEqual('67');
    expect(modelArray[2].get('externalId')).toEqual('3203');

    let coursesPropsArray = coursesCollection.convertFromCourseModelArray(modelArray);
    expect(coursesPropsArray).toBeInstanceOf(Array);
    expect(coursesPropsArray).toHaveLength(3);
    expect(coursesPropsArray[0].externalId).toEqual('154');
    expect(coursesPropsArray[1].externalId).toEqual('67');
    expect(coursesPropsArray[2].externalId).toEqual('3203');
});
