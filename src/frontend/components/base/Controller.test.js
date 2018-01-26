const BaseController = require('./Controller');
const BaseModel = require('../../models/Base');
const h = require('hyperscript');

function getBaseControllerInstance() {
    var viewMock = {};
    var modelMock = {};

    var baseController = Object.create(BaseController);
    baseController.init(viewMock, modelMock);

    return baseController;
}

function getBaseModel() {
    var instance = Object.create(BaseModel);
    instance.init();

    return instance;
}

test('BaseController.interface', function () {
    var baseController = getBaseControllerInstance();

    expect(baseController.handleEvent).toBeInstanceOf(Function);
    expect(baseController.bindEvents).toBeInstanceOf(Function);
});

test('BaseController.bindEvents и handleEvents', function () {
    /**
     * @type {HTMLElement} testDOM
     */
    var testDOM = h('div',
        h('div.test-list'),
        h('div.test-list'),
        h('div.test-list',
            h('a.test-element'),
            h('span.test-element')
        )
    );

    var baseController = getBaseControllerInstance();
    var nodeList = testDOM.querySelectorAll('.test-list');
    var nodeFromList = nodeList.item(1);
    var node = testDOM.querySelector('a.test-element');
    var node2 = testDOM.querySelector('span.test-element');
    var nodeArray = [node, node2];

    var loadHandler = jest.fn();
    var changeHandler= jest.fn();
    var blurHandler = jest.fn();

    baseController.events = [
        {types: ['load'], target: nodeList, handler: loadHandler},
        {types: ['change'], target: node, handler: changeHandler}
    ];

    var additionalEvents = [{types: ['blur'], target: nodeArray, handler: blurHandler}];

    baseController.bindEvents();
    baseController.bindEvents(additionalEvents);

    baseController.events = baseController.events.concat(additionalEvents);

    var loadEvent = new Event('load');
    var changeEvent = new Event('change');
    var blurEvent = new Event('blur');

    nodeFromList.dispatchEvent(loadEvent);
    node2.dispatchEvent(blurEvent);
    node.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(blurHandler).toHaveBeenCalledTimes(1);
    expect(loadHandler).toHaveBeenCalledTimes(1);

    node.dispatchEvent(loadEvent);
    expect(loadHandler).toHaveBeenCalledTimes(1);

    node.dispatchEvent(changeEvent);
    expect(changeHandler).toHaveBeenCalledTimes(2);
});

test('BaseController.bindEvents и handleEvents (модели)', function () {
    var baseController = getBaseControllerInstance();
    var firstHandler = jest.fn();
    var secondHandler = jest.fn();

    var firstModel = getBaseModel();
    var secondModel = getBaseModel();

    baseController.events = [
        {types: ['change.field'], target: firstModel, handler: firstHandler},
        {types: ['change.field'], target: secondModel, handler: secondHandler}
    ];

    baseController.bindEvents();

    firstModel.set('field', 1);
    secondModel.set('field', 2);
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);

    firstModel.set('field', 3);
    expect(firstHandler).toHaveBeenCalledTimes(2);
    expect(secondHandler).toHaveBeenCalledTimes(1);

    expect(firstModel.get('field')).toEqual(3);
    expect(secondModel.get('field')).toEqual(2);
});