const menuFactory = require('./View');

const jss = require('jss').default;

test('MenuView.render', function () {
    var testMenu = [
        {href: '/', text: 'Главная'},
        {href: 'https://humanistic.tech', text: 'Гуманистические технологии'}
    ];

    var verticalDOMElement = document.createElement('div');
    var horizontalDOMElement = document.createElement('div');

    var verticalData = {type: 'vertical', menuItems: testMenu};
    var menuView = menuFactory(verticalDOMElement, jss);
    var verticalDOM = menuView.createDOM(verticalData);
    menuView.render(verticalData);

    var horizontalData = {type: 'horizontal', menuItems: testMenu};
    menuView = menuFactory(horizontalDOMElement, jss);
    var horizontalDOM = menuView.createDOM(horizontalData);
    menuView.render(horizontalData);

    expect(verticalDOM).toBeInstanceOf(HTMLElement);
    expect(horizontalDOM).toBeInstanceOf(HTMLElement);

    testMenu.forEach(function (item) {
        expect(verticalDOMElement.innerHTML).toContain(item.href);
        expect(verticalDOMElement.innerHTML).toContain(item.text);

        expect(horizontalDOMElement.innerHTML).toContain(item.href);
        expect(horizontalDOMElement.innerHTML).toContain(item.text);
    });

});