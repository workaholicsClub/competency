const resultsControllerFactory = require('./Controller');
const resultsViewFactory = require('./View');
const professionsFactory = require('../../models/Professions');
const answersFactory = require('../../models/Answers');
const professionsMockData = require('../../mocks/professions.json');

function getViewInstance() {
    var rootElement = document.createElement('div');
    var stylesManager = {};

    return resultsViewFactory(rootElement, stylesManager);
}

function getControllerInstance() {
    var view = getViewInstance();
    var professionsModel = professionsFactory(professionsMockData);
    var answersModel = answersFactory({'codeQuality': [5, 5, 5, 5]});
    return resultsControllerFactory(view, professionsModel, answersModel);
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