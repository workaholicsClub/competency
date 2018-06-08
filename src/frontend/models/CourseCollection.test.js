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
    let expectedUri = '//test.api.url/courses/search?userSkills[71]=none&userSkills[72]=none&userSkills[73]=none&userSkills[74]=none&userSkills[75]=none&userSkills[76]=none&userSkills[77]=none&userSkills[78]=none&userSkills[79]=none&userSkills[80]=none&userSkills[81]=none&userSkills[82]=none&userSkills[83]=none&userSkills[84]=none&userSkills[85]=none&userSkills[86]=none&userSkills[87]=none&userSkills[88]=none&userSkills[89]=none&userSkills[90]=none&userSkills[91]=none&userSkills[92]=none&userSkills[93]=none&userSkills[94]=none&userSkills[95]=none&userSkills[96]=none&userSkills[97]=none&userSkills[98]=none&userSkills[99]=none&userSkills[100]=none&userSkills[101]=none&userSkills[102]=none&userSkills[103]=none&userSkills[104]=none&userSkills[105]=none&userSkills[106]=none&userSkills[107]=none&userSkills[108]=none&userSkills[109]=none&userSkills[110]=none&userSkills[111]=none&userSkills[112]=none&userSkills[113]=none&userSkills[114]=none&userSkills[115]=none&userSkills[116]=none&userSkills[351]=none&userSkills[352]=none&userSkills[353]=none&userSkills[354]=knowledge&userSkills[355]=none&userSkills[356]=none&userSkills[357]=none&userSkills[358]=none&userSkills[359]=none&userSkills[360]=none&userSkills[361]=none&userSkills[362]=none&userSkills[363]=none&userSkills[364]=none&userSkills[365]=none&userSkills[366]=none&userSkills[367]=none&userSkills[368]=none&userSkills[369]=none&userSkills[370]=none&userSkills[371]=none&userSkills[372]=none&userSkills[373]=none&userSkills[374]=none&userSkills[375]=none&userSkills[376]=none&userSkills[377]=none&userSkills[378]=none&userSkills[379]=none&userSkills[380]=none&userSkills[381]=none&userSkills[382]=none&userSkills[383]=none&userSkills[384]=none&userSkills[385]=none&userSkills[386]=none&userSkills[387]=none&userSkills[388]=none&userSkills[389]=none&userSkills[207]=none&userSkills[208]=none&userSkills[209]=none&userSkills[210]=none&userSkills[211]=none&userSkills[212]=none&userSkills[213]=none&userSkills[214]=none&userSkills[215]=none&userSkills[216]=none&userSkills[217]=none&userSkills[218]=none&userSkills[219]=none&userSkills[220]=none&userSkills[221]=none&userSkills[222]=none&userSkills[223]=none&userSkills[224]=none&userSkills[225]=none&userSkills[226]=none&userSkills[227]=none&userSkills[228]=none&userSkills[511]=none&userSkills[307]=none&userSkills[308]=none&userSkills[309]=none&userSkills[310]=none&userSkills[311]=none&userSkills[312]=none&userSkills[313]=none&userSkills[314]=none&userSkills[315]=none&userSkills[316]=none&userSkills[317]=none&userSkills[318]=none&userSkills[319]=none&userSkills[320]=none&userSkills[321]=none&userSkills[322]=none&userSkills[323]=none&userSkills[324]=none&userSkills[325]=none&userSkills[326]=none&userSkills[327]=none&userSkills[328]=none&userSkills[329]=none&userSkills[330]=none&userSkills[331]=none&userSkills[332]=none&userSkills[333]=none&userSkills[334]=none&userSkills[335]=none&userSkills[336]=none&userSkills[337]=none&userSkills[338]=none&userSkills[339]=none&userSkills[340]=none&userSkills[341]=none&userSkills[342]=none&userSkills[343]=none&userSkills[344]=none&userSkills[345]=none&userSkills[346]=skill&userSkills[347]=none&userSkills[348]=none&userSkills[349]=none&userSkills[350]=none&modeOfStudy[]=selfStudy&courseForm[]=video&certificate=1';
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

test('CourseCollection prepareSkillsField', function () {
    let answersModel = answersFactory({
        python: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        testAutomation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0]
    });

    let professionsModel = professionsFactory(professionsMockData);
    let professionCompetencies = professionsModel.getCompetencies('tester');

    let fieldsData = [
        {code: 'userSkills', label: 'Навыки', type: 'competency', value: ["python", "testAutomation"], variants: professionCompetencies},
        {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: ['selfStudy'], variants: [
                {name: "Очная", code: "inPerson", info: "Аудиторные занятия с преподавателями"},
                {name: "Дистанционная", code: "longDistance", info: "Периодическое взаимодействие с преподавателями по электропочте, skype для получения образовательных материалов и задач, обсуждения их выполнения"},
                {name: "Онлайн", code: "online", info: "Работа с образовательными материалами и преподавателями в режиме онлайн"},
                {name: "Очная и онлайн", code: "inPersonOnline", info: "Совмещение аудиторных и онлайн занятий"},
                {name: "Самостоятельное обучение", code: "selfStudy", info: "Самостоятельное изучение материалов без участия преподавателя или куратора"}
            ]},
        {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: ['video'], variants: [
                {name: "Видеокурс", code: "video"},
                {name: "Текстовый курс", code: "text"},
                {name: "Интерактивный курс", code: "interactive"},
                {name: "Интенсив", code: "crashCourse"},
                {name: "Тренинг", code: "training"}
            ]},
        {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: '1'}
    ];

    let courses = coursesFactory({}, configMockFactory());
    let preparedFieldData = courses.prepareSkillsField('userSkills', answersModel, fieldsData);
    expect(preparedFieldData).toHaveLength(152);
    expect(preparedFieldData[0]).toEqual('userSkills[71]=none');
    expect(preparedFieldData[49]).toEqual('userSkills[354]=knowledge');
    expect(preparedFieldData[147]).toEqual('userSkills[346]=skill');
    expect(preparedFieldData[151]).toEqual('userSkills[350]=none');
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
