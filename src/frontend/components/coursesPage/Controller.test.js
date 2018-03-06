const coursesControllerFactory = require('./Controller');
const coursesViewFactory = require('./View');
const listViewFactory = require('./CoursesListView');
const filterViewFactory = require('../filter/View');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const coursesFactory = require('../../models/Courses');
const trackerFactory = require('../../classes/GTagTracker');
const professionsMockData = require('../../mocks/professions.json');
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

function getControllerInstance(xhr, gtag) {
    let view = getViewInstance();
    let stylesManager = getStylesManager();
    let coursesList = listViewFactory(stylesManager);
    let filterView = filterViewFactory(stylesManager);

    let professionsModel = professionsFactory(professionsMockData);

    let answersModel = answersFactory({'codeQuality': [5, 5, 5, 5]}, configMock());
    answersModel.isLoaded = function () {
        return true;
    };

    let coursesModel = coursesFactory({}, configMock());

    if (!gtag) {
        gtag = jest.fn();
    }

    let tracker = trackerFactory(gtag, configMock());

    return coursesControllerFactory(view, coursesList, filterView, professionsModel, answersModel, coursesModel, xhr, tracker);
}

test('ResultsController.interface', function () {
    let resultsController = getControllerInstance();

    expect(resultsController.handleEvent).toBeInstanceOf(Function);
    expect(resultsController.bindEvents).toBeInstanceOf(Function);
});

test('ResultsController.getViewModel', function () {
    let resultsController = getControllerInstance();
    let viewModel = resultsController.getViewModel();

    expect(viewModel).toHaveProperty('allCompetencies');
    expect(viewModel.allCompetencies).toHaveLength(1);
    expect(viewModel.allCompetencies[0]).toHaveProperty('code');
    expect(viewModel.allCompetencies[0]).toHaveProperty('rating');
    expect(viewModel.allCompetencies[0].code).toEqual('codeQuality');
    expect(viewModel.allCompetencies[0].rating).toEqual(4);
});