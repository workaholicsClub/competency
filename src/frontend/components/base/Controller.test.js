const BaseController = require('./Controller');
const h = require('hyperscript');

function getBaseControllerInstance() {
    var viewMock = {};
    var modelMock = {};

    var baseController = Object.create(BaseController);
    baseController.init(viewMock, modelMock);

    return baseController;
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