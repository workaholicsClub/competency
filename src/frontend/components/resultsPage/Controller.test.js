const resultsControllerFactory = require('./Controller');
const resultsViewFactory = require('./View');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const coursesFactory = require('../../models/Courses');
const trackerFactory = require('../../classes/GTagTracker');
const professionsMockData = require('../../mocks/professions.json');
const jss = require('jss');
const jsspreset = require('jss-preset-default').default;
const configMock = require('../../mocks/Config');

function getViewInstance() {
    var rootElement = document.createElement('div');
    var stylesManager = jss.create(jsspreset());

    return resultsViewFactory(rootElement, stylesManager);
}

function getControllerInstance(xhr, gtag) {
    var view = getViewInstance();
    var professionsModel = professionsFactory(professionsMockData);

    var answersModel = answersFactory({'codeQuality': [5, 5, 5, 5]}, configMock());
    answersModel.isLoaded = function () {
        return true;
    };

    var coursesModel = coursesFactory({}, configMock());

    if (!gtag) {
        gtag = jest.fn();
    }

    var tracker = trackerFactory(gtag, configMock());

    return resultsControllerFactory(view, professionsModel, answersModel, coursesModel, xhr, tracker);
}

test('ResultsController.interface', function () {
    var resultsController = getControllerInstance();

    expect(resultsController.handleEvent).toBeInstanceOf(Function);
    expect(resultsController.bindEvents).toBeInstanceOf(Function);
});

test('ResultsController.getViewModel', function () {
    var resultsController = getControllerInstance();
    var viewModel = resultsController.getViewModel();

    expect(viewModel).toHaveProperty('competencies');
    expect(viewModel.competencies).toHaveLength(1);
    expect(viewModel.competencies[0]).toHaveProperty('code');
    expect(viewModel.competencies[0]).toHaveProperty('rating');
    expect(viewModel.competencies[0].code).toEqual('codeQuality');
    expect(viewModel.competencies[0].rating).toEqual(4);
});

test('ResultsController.trackSaveResults', function () {
    var gtag = jest.fn();
    var initCallCount = 2;

    var resultsController = getControllerInstance(undefined, gtag);
    expect(gtag).toHaveBeenCalledTimes(initCallCount);

    resultsController.trackSaveResults();
    expect(gtag).toHaveBeenCalledTimes(initCallCount+1);
});