const notFoundControllerFactory = require('./Controller');
const notFoundViewFactory = require('./View');

test('NotFoundController.interface', function () {
    var rootElement = document.createElement('div');
    var stylesManager = {};

    var view = notFoundViewFactory(rootElement, stylesManager);
    var controller = notFoundControllerFactory(view);

    expect(controller.handleEvent).toBeInstanceOf(Function);
    expect(controller.bindEvents).toBeInstanceOf(Function);
    expect(controller.renderNotFoundPage).toBeInstanceOf(Function);
});