const StateMixin = require('./StateMixin');

test('StateMixin.initProps', function () {
    var state = Object.create(StateMixin);

    state.initProps({a: 1, b: 2, c: {flag: 1}});

    expect(state.get('a')).toBe(1);
    expect(state.get('b')).toBe(2);
    expect(state.get('c')).toEqual({flag: 1});
    expect(state.get('d')).toBeNull();

    var props = {a: 1, b: 2};
    state.initProps(props);
    expect(state.get('a')).toBe(1);
    expect(state.get('c')).toBeNull();

    props.a = 2;
    expect(state.get('a')).toBe(1);
});

test('StateMixin.setWithoutEvent', function () {
    var state = Object.create(StateMixin);
    state.initProps();

    var testObject = {b: 1};

    state.setWithoutEvent('a', 1);
    state.setWithoutEvent('b', testObject);

    expect(state.get('a')).toBe(1);
    expect(state.get('b')).toEqual(testObject);
});

test('StateMixin.setWithoutEvent (неизменяемость)', function () {
    var state = Object.create(StateMixin);
    state.initProps();

    var testObject = {a: 1, b: 2};
    var originalTestObject = Object.assign({}, testObject);

    state.setWithoutEvent('a', testObject);
    expect(state.get('a')).toEqual(testObject);

    testObject.a = 2;
    expect(state.get('a')).toEqual(originalTestObject);

    var innerObject = state.get('a');
    expect(innerObject).toEqual(originalTestObject);

    innerObject.a = 2;
    expect(state.get('a')).toEqual(originalTestObject);
});

test('StateMixin.has', function () {
    var state = Object.create(StateMixin);
    state.initProps({a: 1, b: 2, c: {flag: 1}});

    expect(state.has('a')).toBe(true);
    expect(state.has('c')).toBe(true);
    expect(state.has('d')).toBe(false);
    expect(state.has('flag')).toBe(false);
});

test('StateMixin.setProps', function () {
    var state = Object.create(StateMixin);
    state.initProps();

    var testObject = {a: 1, b: 2};

    state.setPropsWithoutEvent(testObject);

    expect(state.get('a')).toBe(1);
    expect(state.get('b')).toBe(2);

    testObject.a = 2;
    expect(state.get('a')).toBe(1);

    expect(function () {
        state.setPropsWithoutEvent(false);
    }).toThrow();

    expect(function () {
        state.setPropsWithoutEvent({});
    }).toThrow();

    expect(function () {
        state.setPropsWithoutEvent(null);
    }).toThrow();

    expect(function () {
        state.setPropsWithoutEvent(undefined);
    }).toThrow();
});

test('StateMixin.getProps', function () {
    var state = Object.create(StateMixin);
    state.initProps();

    var expectedProps = {a: 1, b: 2};

    state.setPropsWithoutEvent(expectedProps);
    expect(state.getProps()).toEqual(expectedProps);
});

test('StateMixin.setPropsWithoutEvent (неизменяемость)', function () {
    var state = Object.create(StateMixin);
    state.initProps();

    var subObject = {flag: 1};
    var originalSubObject = Object.assign({}, subObject);
    var testObject = {a: 1, b: 2, c: subObject};

    state.setPropsWithoutEvent(testObject);

    expect(state.get('a')).toBe(1);
    expect(state.get('b')).toBe(2);
    expect(state.get('c')).toEqual(subObject);

    testObject.a = 2;
    expect(state.get('a')).toBe(1);

    subObject.flag = 0;
    expect(state.get('c')).toEqual(originalSubObject);

    var innerSubObject = state.get('c');
    innerSubObject.flag = 0;
    expect(state.get('c')).toEqual(originalSubObject);
});