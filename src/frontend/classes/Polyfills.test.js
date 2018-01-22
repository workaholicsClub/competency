const polyfillsFactory = require('./Polyfills');

test('Требуемые функции определены', function () {
    polyfillsFactory();
    expect(Object.assign).toBeInstanceOf(Function);
});

test('Object.assign', function () {
    polyfillsFactory();
    var o1 = {'a': 1, 'b': 2};
    var o2 = {'b': 3, 'c': 4};

    o3 = Object.assign(Object.create(o1), o2);
    o3.d = 5;

    expect(o3.a).toBe(1);
    expect(o3.b).toBe(3);
    expect(o3.c).toBe(4);
    expect(o3.d).toBe(5);

    expect(o1.b).toBe(2);
    expect(o2.b).toBe(3);
    expect(o1.d).toBeUndefined();
    expect(o2.d).toBeUndefined();
});