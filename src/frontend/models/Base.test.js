const BaseModel = require('./Base');
const sleep = require('../mocks/sleep.fn.js');

test('BaseModel.interface', function () {
    var model = Object.create(BaseModel);
    model.init();

    expect(model.addEventListener).toBeInstanceOf(Function);
    expect(model.removeEventListener).toBeInstanceOf(Function);
    expect(model.dispatchEvent).toBeInstanceOf(Function);
});

test('BaseModel.init', function () {
    var model = Object.create(BaseModel);
    model.init({test: '123'});
    expect(model.props.test).toBe('123');

    model = Object.create(BaseModel);
    model.init({test: '456'});
    expect(model.props.test).toBe('456');
});

test('BaseModel.events', function () {
    var model = Object.create(BaseModel);
    model.init();

    var eventHandler = jest.fn();

    model.addEventListener('test', eventHandler);

    var testEvent = new Event('test');
    model.dispatchEvent(testEvent);
    expect(eventHandler).toBeCalled();

    model.removeEventListener('test', eventHandler);
    model.dispatchEvent(testEvent);
    expect(eventHandler).toHaveBeenCalledTimes(1);
});

test('BaseModel.modelEvent', function () {
    var model = Object.create(BaseModel);
    model.init();

    var eventHandler = jest.fn();

    model.addEventListener('test', eventHandler);
    model.dispatchModelEvent('test');
    expect(eventHandler).toBeCalled();
});

test('BaseModel.setPropsWithoutEvent', function () {
    var model = Object.create(BaseModel);
    model.init();

    var changeHandler = jest.fn();

    model.addEventListener('change', changeHandler);

    model.setProps({'a': 1, 'b': 2});
    expect(model.props.a).toBe(1);
    expect(model.props.b).toBe(2);
    expect(changeHandler).toHaveBeenCalledTimes(1);

    model.setProps({'a': 3, 'b': null});
    expect(model.props.a).toBe(3);
    expect(model.props.b).toBe(2);
    expect(changeHandler).toHaveBeenCalledTimes(2);

    model.setPropsWithoutEvent({'a': null, 'b': 4});
    expect(model.props.a).toBe(3);
    expect(model.props.b).toBe(4);
    expect(changeHandler).toHaveBeenCalledTimes(2);
});

test('BaseModel.set', function () {
    var model = Object.create(BaseModel);
    model.init();

    var changeHandler = jest.fn();

    model.addEventListener('change.test', changeHandler);
    model.set('test', 123);
    expect(model.get('test')).toBe(123);
    expect(changeHandler).toHaveBeenCalledTimes(1);
});

test('BaseModel подряд идущие вызовы', function () {
    var model = Object.create(BaseModel);
    model.init();

    var changeHandler = jest.fn();

    model.addEventListener('change.test', changeHandler);
    model.set('test', 123);
    model.set('test', 124);
    expect(model.get('test')).toBe(124);
    expect(changeHandler).toHaveBeenCalledTimes(2);
    model.removeEventListener('change.test', changeHandler);
});

test('BaseModel долгий обработчик перед коротким', function () {
    var eventTriggerModel = Object.create(BaseModel);
    eventTriggerModel.init();

    var test = Object.create(BaseModel);
    test.init();

    var shortHandler = function () {
        sleep(100);
        test.setWithoutEvent('callOrder', 'afterShort');
    };

    var longHandler = function () {
        sleep(500);
        test.setWithoutEvent('callOrder', 'afterLong');
    };

    eventTriggerModel.addEventListener('change.test', longHandler);
    eventTriggerModel.addEventListener('change.test', shortHandler);
    eventTriggerModel.set('test', 125);

    expect(test.get('callOrder')).toBe('afterShort');
});

test('BaseModel уменьшающийся интервал', function () {
    var eventTriggerModel = Object.create(BaseModel);
    eventTriggerModel.init();

    var test = Object.create(BaseModel);
    test.init();
    test.setWithoutEvent('callOrder', []);

    var counter = 1;
    var testValues = ['a', 'b', 'c', 'd', 'e'];

    var changeHandler = function () {
        test.setWithoutEvent('testProp', testValues[counter-1]);

        var callOrder = test.get('callOrder');
        callOrder.push(counter);
        test.setWithoutEvent('callOrder', callOrder);
        counter++;

        sleep(100 - 10 * counter);
    };

    eventTriggerModel.addEventListener('change.test', changeHandler);
    eventTriggerModel.set('test', 1);
    eventTriggerModel.set('test', 2);
    eventTriggerModel.set('test', 3);
    eventTriggerModel.set('test', 4);
    eventTriggerModel.set('test', 5);

    expect(test.get('callOrder')).toEqual([1, 2, 3, 4, 5]);
    expect(test.get('testProp')).toEqual('e');
});