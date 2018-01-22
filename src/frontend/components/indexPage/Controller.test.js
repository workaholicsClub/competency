const indexControllerFactory = require('./Controller');
const indexPageViewFactory = require('./View');
const professionsModelFactory = require('../../models/Professions');

test('IndexController.interface', function () {
    var rootElement = document.createElement('div');
    var professionsModel = professionsModelFactory({});
    var stylesManager = {};

    var indexView = indexPageViewFactory(rootElement, stylesManager);
    var indexController = indexControllerFactory(indexView, professionsModel);

    expect(indexController.handleEvent).toBeInstanceOf(Function);
    expect(indexController.bindEvents).toBeInstanceOf(Function);
});