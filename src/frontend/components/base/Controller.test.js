const BaseController = require('./Controller');
const BaseModel = require('../../models/Base');
const h = require('hyperscript');

function getBaseControllerInstance() {
    let viewMock = {};
    let modelMock = {};

    let baseController = Object.create(BaseController);
    baseController.init(viewMock, modelMock);

    return baseController;
}

function getBaseModel() {
    let instance = Object.create(BaseModel);
    instance.init();

    return instance;
}

test('BaseController.interface', function () {
    let baseController = getBaseControllerInstance();

    expect(baseController.handleEvent).toBeInstanceOf(Function);
    expect(baseController.bindEvents).toBeInstanceOf(Function);
});

test('BaseController.bindEvents и handleEvents', function () {
    /**
     * @type {HTMLElement} testDOM
     */
    let testDOM = h('div',
        h('div.test-list'),
        h('div.test-list'),
        h('div.test-list',
            h('a.test-element'),
            h('span.test-element')
        )
    );

    let baseController = getBaseControllerInstance();
    let nodeList = testDOM.querySelectorAll('.test-list');
    let nodeFromList = nodeList.item(1);
    let node = testDOM.querySelector('a.test-element');
    let node2 = testDOM.querySelector('span.test-element');
    let nodeArray = [node, node2];

    let loadHandler = jest.fn();
    let changeHandler= jest.fn();
    let blurHandler = jest.fn();

    baseController.events = [
        {types: ['load'], target: nodeList, handler: loadHandler},
        {types: ['change'], target: node, handler: changeHandler}
    ];

    let additionalEvents = [{types: ['blur'], target: nodeArray, handler: blurHandler}];

    baseController.bindEvents();
    baseController.bindEvents(additionalEvents);

    baseController.events = baseController.events.concat(additionalEvents);

    let loadEvent = new Event('load');
    let changeEvent = new Event('change');
    let blurEvent = new Event('blur');

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
    let baseController = getBaseControllerInstance();
    let firstHandler = jest.fn();
    let secondHandler = jest.fn();

    let firstModel = getBaseModel();
    let secondModel = getBaseModel();

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

test('BaseController removeEvent', function () {
    /**
     * @type {HTMLElement} testDOM
     */
    let testDOM = h('div',
        h('div.test-list'),
        h('div.test-list'),
        h('div.test-list',
            h('a.test-element'),
            h('span.test-element')
        )
    );

    let baseController = getBaseControllerInstance();
    let node = testDOM.querySelector('a.test-element');
    let node2 = testDOM.querySelector('span.test-element');

    let changeHandler = jest.fn();
    let changeHandler2 = jest.fn();

    baseController.events = [
        {types: ['change'], target: node, handler: changeHandler},
        {types: ['change'], target: node2, handler: changeHandler2}
    ];

    baseController.bindEvents();

    let changeEvent = new Event('change');
    node.dispatchEvent(changeEvent);
    node2.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler2).toHaveBeenCalledTimes(1);

    let removeListenerOnly = true;
    baseController.removeEvent(1, removeListenerOnly);
    expect(baseController.events).toHaveLength(2);

    node.dispatchEvent(changeEvent);
    node2.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(2);
    expect(changeHandler2).toHaveBeenCalledTimes(1);

    removeListenerOnly = false;
    baseController.removeEvent(0, removeListenerOnly);
    expect(baseController.events).toHaveLength(1);

    node.dispatchEvent(changeEvent);
    node2.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(2);
    expect(changeHandler2).toHaveBeenCalledTimes(1);
});

test('BaseController replaceEvent', function () {
    /**
     * @type {HTMLElement} testDOM
     */
    let testDOM = h('div',
        h('div.test-list'),
        h('div.test-list'),
        h('div.test-list',
            h('a.test-element'),
            h('span.test-element'),
            h('p.test-element')
        )
    );

    let baseController = getBaseControllerInstance();
    let node = testDOM.querySelector('a.test-element');
    let node2 = testDOM.querySelector('span.test-element');
    let node3 = testDOM.querySelector('p.test-element');

    let changeHandler = jest.fn();
    let changeHandler2 = jest.fn();
    let changeHandler3 = jest.fn();

    baseController.events = [
        {types: ['change'], target: node, handler: changeHandler},
        {types: ['change'], target: node2, handler: changeHandler2}
    ];

    baseController.bindEvents();

    let changeEvent = new Event('change');
    node.dispatchEvent(changeEvent);
    node2.dispatchEvent(changeEvent);
    node3.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler2).toHaveBeenCalledTimes(1);
    expect(changeHandler3).toHaveBeenCalledTimes(0);

    let newEvent = {types: ['change'], target: node3, handler: changeHandler3};
    baseController.replaceEvent(1, newEvent);

    expect(baseController.events).toHaveLength(2);

    node.dispatchEvent(changeEvent);
    node2.dispatchEvent(changeEvent);
    node3.dispatchEvent(changeEvent);

    expect(changeHandler).toHaveBeenCalledTimes(2);
    expect(changeHandler2).toHaveBeenCalledTimes(1);
    expect(changeHandler3).toHaveBeenCalledTimes(1);
});