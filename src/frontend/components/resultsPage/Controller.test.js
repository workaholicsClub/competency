const resultsControllerFactory = require('./Controller');
const resultsViewFactory = require('./View');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const trackerFactory = require('../../classes/GTagTracker');
const professionsMockData = require('../../mocks/professions.json');
const jss = require('jss');
const jsspreset = require('jss-preset-default').default;
const configMock = require('../../mocks/Config');

function getViewInstance() {
    let rootElement = document.createElement('div');
    let stylesManager = jss.create(jsspreset());

    return resultsViewFactory(rootElement, stylesManager);
}

function getControllerInstance(xhr, gtag) {
    let view = getViewInstance();
    let professionCode = 'tester';
    let professionsModel = professionsFactory(professionsMockData);

    let answersModel = answersFactory({
        'codeQuality': [3, 3, 3, 3],
        'operatingSystems': [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, configMock());
    answersModel.isLoaded = function () {
        return true;
    };

    if (!gtag) {
        gtag = jest.fn();
    }

    let tracker = trackerFactory(gtag, configMock());

    return resultsControllerFactory(view, professionsModel, answersModel, xhr, tracker, professionCode);
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
    expect(viewModel.allCompetencies).toHaveLength(2);
    expect(viewModel.allCompetencies[0]).toHaveProperty('name');
    expect(viewModel.allCompetencies[0]).toHaveProperty('code');
    expect(viewModel.allCompetencies[0]).toHaveProperty('rating');
    expect(viewModel.allCompetencies[0]).toHaveProperty('ratingPercent');
    expect(viewModel.allCompetencies[0].code).toEqual('codeQuality');
    expect(viewModel.allCompetencies[0].rating).toEqual(3);
    expect(viewModel.allCompetencies[0].ratingPercent).toEqual(100);

    expect(viewModel).toHaveProperty('professionName');
    expect(viewModel.professionName).toEqual('Тестировщик (Python)');

    let testCompetency = viewModel.professionCompetencies[3];
    expect(viewModel).toHaveProperty('professionCompetencies');
    expect(viewModel.professionCompetencies).toHaveLength(7);
    expect(testCompetency).toHaveProperty('name');
    expect(testCompetency).toHaveProperty('code');
    expect(testCompetency).toHaveProperty('rating');
    expect(testCompetency).toHaveProperty('ratingPercent');
    expect(testCompetency).toHaveProperty('average');
    expect(testCompetency).toHaveProperty('link');
    expect(testCompetency.code).toEqual('operatingSystems');
    expect(testCompetency.rating).toEqual(0.14);
    expect(testCompetency.ratingPercent).toEqual(5);

    let average = testCompetency.average;
    expect(average).toHaveProperty('lower');
    expect(average).toHaveProperty('upper');
    expect(average).toHaveProperty('average');
    expect(average).toHaveProperty('diff');
    expect(average.lower).toEqual(33);
    expect(average.upper).toEqual(67);
    expect(average.average).toEqual(50);
    expect(average.diff).toEqual(-29);
});

test('ResultsController.getRatingAverage', function () {
    let resultsController = getControllerInstance();
    let competency = {};

    let average = resultsController.getRatingAverage(competency, 0.25);
    expect(average.lower).toEqual(33);
    expect(average.upper).toEqual(67);
    expect(average.average).toEqual(50);
    expect(average.diff).toEqual(-25);

    average = resultsController.getRatingAverage(competency, 1.5);
    expect(average.lower).toEqual(33);
    expect(average.upper).toEqual(67);
    expect(average.average).toEqual(50);
    expect(average.diff).toEqual(0);

    average = resultsController.getRatingAverage(competency, 3.25);
    expect(average.lower).toEqual(33);
    expect(average.upper).toEqual(67);
    expect(average.average).toEqual(50);
    expect(average.diff).toEqual(42);

    average = resultsController.getRatingAverage(competency, false);
    expect(average.lower).toEqual(33);
    expect(average.upper).toEqual(67);
    expect(average.average).toEqual(50);
    expect(average.diff).toEqual(false);
});

test('ResultsController.trackSaveResults', function () {
    let gtag = jest.fn();
    let initCallCount = 2;

    let resultsController = getControllerInstance(undefined, gtag);
    expect(gtag).toHaveBeenCalledTimes(initCallCount);

    resultsController.trackSaveResults();
    expect(gtag).toHaveBeenCalledTimes(initCallCount+1);
});