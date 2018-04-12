const BaseModel = require('./Base');
const filterFactory = require('./Filter');
const storageMockFactory = require('../mocks/Storage');

test('FilterModel.interface', function () {
    let filterModel = filterFactory({});

    expect(BaseModel.isPrototypeOf(filterModel)).toBeTruthy();
    expect(filterModel.addEventListener).toBeInstanceOf(Function);
    expect(filterModel.removeEventListener).toBeInstanceOf(Function);
    expect(filterModel.dispatchEvent).toBeInstanceOf(Function);
    expect(filterModel.set).toBeInstanceOf(Function);
    expect(filterModel.get).toBeInstanceOf(Function);
    expect(filterModel.initStorage).toBeInstanceOf(Function);
    expect(filterModel.saveData).toBeInstanceOf(Function);
    expect(filterModel.loadData).toBeInstanceOf(Function);
    expect(filterModel.bindChangeHandlers).toBeInstanceOf(Function);
});

test('Multiple filters', function () {
    let filter1 = filterFactory({});
    let filter2 = filterFactory({});

    filter1.set('a', 1);
    filter1.set('b', 2);
    filter2.set('a', 3);

    expect(filter1.get('a')).toEqual(1);
    expect(filter1.get('b')).toEqual(2);
    expect(filter2.get('a')).toEqual(3);
    expect(filter2.get('b')).toBeNull();
});

test('Multiple filters storage', function () {
    let storage1 = storageMockFactory('filter1');
    let storage2 = storageMockFactory('filter2');

    let filter1 = filterFactory({}, false, storage1);
    let filter2 = filterFactory({}, false, storage2);

    let expectedStorage1Data = {a: 1, b: 2};
    let expectedStorage2Data = {a: 3, c: 4};

    filter1.set('a', 1);
    filter1.set('b', 2);
    filter2.set('a', 3);
    filter2.set('c', 4);

    expect(storage1.load()).toEqual(expectedStorage1Data);
    expect(storage2.load()).toEqual(expectedStorage2Data);

    let filter3 = filterFactory({}, false, storage1);
    let filter4 = filterFactory({}, false, storage2);

    expect(filter3.get('a')).toEqual(1);
    expect(filter3.get('b')).toEqual(2);
    expect(filter4.get('a')).toEqual(3);
    expect(filter4.get('c')).toEqual(4);
});