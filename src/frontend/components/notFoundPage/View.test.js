const notFoundViewFactory = require('./View');

const jss = require('jss').default;

test('NotFoundView.createDOM', function () {
    var DOMelement = document.createElement('div');
    var view = notFoundViewFactory(DOMelement, jss);
    var viewDOM = view.createDOM();
    expect(viewDOM).toBeInstanceOf(HTMLElement);
});

test('IndexView.render', function () {
    var DOMelement = document.createElement('div');
    var view = notFoundViewFactory(DOMelement, jss);

    view.render();

    expect(view.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});
