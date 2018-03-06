const BaseModel = require('./Base');
const filterFactory = require('./Filter');

test('FilterModel.interface', function () {
    let filterModel = filterFactory({});

    expect(BaseModel.isPrototypeOf(filterModel)).toBeTruthy();
    expect(filterModel.addEventListener).toBeInstanceOf(Function);
    expect(filterModel.removeEventListener).toBeInstanceOf(Function);
    expect(filterModel.dispatchEvent).toBeInstanceOf(Function);
    expect(filterModel.set).toBeInstanceOf(Function);
    expect(filterModel.get).toBeInstanceOf(Function);
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