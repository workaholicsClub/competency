const BaseController = require('./Controller');

test('BaseController.interface', function () {
    var viewMock = {};
    var modelMock = {};

    var baseController = Object.create(BaseController);
    baseController.init(viewMock, modelMock);

    expect(baseController.handleEvent).toBeInstanceOf(Function);
    expect(baseController.bindEvents).toBeInstanceOf(Function);
});