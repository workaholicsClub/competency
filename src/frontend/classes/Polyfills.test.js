const polyfillsFactory = require('./Polyfills');
const h = require('hyperscript');

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

test('Element.closest', function () {
    polyfillsFactory();

    /**
     * @type {HTMLElement} testDOM
     */
    var testDOM = h('div#e1.a',
        h('div#e2.b'),
        h('div#e3.c',
            h('div#e5.d')
        ),
        h('div#e4.c')
    );

    var child = testDOM.querySelector('#e5');
    var parent = child.closest('.c');
    var nonExistentParent = child.closest('.b');

    expect(parent).toBeInstanceOf(HTMLElement);
    expect(parent.getAttribute('id')).toEqual('e3');
    expect(nonExistentParent).toBeNull();
});