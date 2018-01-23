const footerFactory = require('./View');
const jss = require('jss').default;

test('FooterView.createDOM', function () {
    var footerView = footerFactory(jss);
    var footerViewDOM = footerView.createDOM({});
    expect(footerViewDOM).toBeInstanceOf(HTMLElement);
});

test('FooterView.createBottomMenu', function () {
    var footerView = footerFactory(jss);
    var menuDOM = footerView.createBottomMenu();
    expect(menuDOM).toBeInstanceOf(HTMLElement);
});
