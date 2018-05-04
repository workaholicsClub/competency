const coursesControllerFactory = require('./Controller');
const coursesViewFactory = require('./View');
const listViewFactory = require('./CoursesListView');
const filterViewFactory = require('../filter/View');
const filterControllerFactory = require('../filter/Controller');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const filterFactory = require('../../models/Filter');
const coursesFactory = require('../../models/CourseCollection');
const trackerFactory = require('../../classes/GTagTracker');
const userFactory = require('../../models/User');
const filterFieldsMockData = require('../../mocks/filterFieldsData')();
const professionsMockData = require('../../mocks/professions.json');
const coursesMockData = require('../../mocks/coursesSearch.json');
const jss = require('jss');
const jsspreset = require('jss-preset-default').default;
const configMock = require('../../mocks/Config');

function getStylesManager() {
    return jss.create(jsspreset());
}

function getViewInstance() {
    let rootElement = document.createElement('div');
    let stylesManager = getStylesManager();

    return coursesViewFactory(rootElement, stylesManager);
}

function getControllerInstance(xhr, gtag, rootElement, professionCode, user) {
    let view = getViewInstance();
    let stylesManager = getStylesManager();
    let coursesList = listViewFactory(stylesManager);

    if (!rootElement) {
        rootElement = document.createElement('div');
    }

    let answersModel = answersFactory({'codeQuality': [3, 3, 3, 3]}, configMock());
    answersModel.isLoaded = function () {
        return true;
    };

    let filterView = filterViewFactory(rootElement, stylesManager);
    let filterModel = filterFactory();
    let filterController = filterControllerFactory(filterView, filterModel, answersModel, filterFieldsMockData);

    let professionsModel = professionsFactory(professionsMockData);
    if (professionCode) {
        professionsModel.setProfessionCode(professionCode);
    }

    let coursesModel = coursesFactory({}, configMock());
    coursesModel.loadedCourses = coursesModel.convertToCourseModelArray(coursesMockData.course);

    if (!gtag) {
        gtag = jest.fn();
    }

    if (!user) {
        user = userFactory({});
    }

    let tracker = trackerFactory(gtag, configMock());

    return coursesControllerFactory(view, coursesList, filterController, filterModel, professionsModel, answersModel, coursesModel, xhr, tracker, user);
}

test('CoursesController.interface', function () {
    let controller = getControllerInstance();

    expect(controller.handleEvent).toBeInstanceOf(Function);
    expect(controller.bindEvents).toBeInstanceOf(Function);
});

test('CoursesController.getViewModel', function () {
    let user = userFactory({
        'id': 'e658fc48-c1ae-480e-b87e-a391706de722',
        'sessionId': 'a20bf398-3e88-4084-a4e0-8f2f4631e173'
    });
    let controller = getControllerInstance(null, null, null, 'tester', user);
    let viewModel = controller.getViewModel();
    let expectedCourseUrl = 'https://api.test/api/course/go/web-tehnologii?userId=e658fc48-c1ae-480e-b87e-a391706de722&sessionId=a20bf398-3e88-4084-a4e0-8f2f4631e173';

    expect(viewModel).toHaveProperty('allCompetencies');
    expect(viewModel).toHaveProperty('courses');
    expect(viewModel).toHaveProperty('professions');
    expect(viewModel).toHaveProperty('fieldNames');
    expect(viewModel).toHaveProperty('fieldVariants');
    expect(viewModel.allCompetencies).toHaveLength(1);
    expect(viewModel.allCompetencies[0]).toHaveProperty('code');
    expect(viewModel.allCompetencies[0]).toHaveProperty('rating');
    expect(viewModel.allCompetencies[0].code).toEqual('codeQuality');
    expect(viewModel.allCompetencies[0].rating).toEqual(3);

    let courseData = viewModel.courses[0];
    expect(courseData.url).toEqual(expectedCourseUrl);
});

test('CoursesController.renderFilter', function () {
    let rootElement = document.createElement('div');
    let professionCode = 'tester';
    let controller = getControllerInstance(undefined, undefined, rootElement, professionCode);

    controller.renderFilter();

    let userCompetenciesSelect = rootElement.querySelector('[data-code=userSkills] select');
    expect( userCompetenciesSelect ).toBeInstanceOf(HTMLElement);

    let userCompetenciesOptions = userCompetenciesSelect.querySelectorAll('option');
    expect( userCompetenciesOptions ).toBeInstanceOf(NodeList);
    expect( userCompetenciesOptions ).toHaveLength(8); //7 компетенций + "Не выбрано"
});