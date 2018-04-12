const indexViewFactory = require('./View');

const jss = require('jss').default;
const sleep = require('../../mocks/sleep.fn.js');

test('IndexView.loadingInterval', function () {
    let DOMelement = document.createElement('div');
    let milisecondsToCatchOneTick = 1000;
    let testIntervalId = 1;
    let intervalInterface = {
        setInterval: jest.fn().mockReturnValue(testIntervalId),
        clearInterval: jest.fn()
    };

    let indexView = indexViewFactory(DOMelement, jss, intervalInterface);
    indexView.startLoadProgress();

    sleep(milisecondsToCatchOneTick);

    indexView.stopLoadProgress();
    expect(intervalInterface.setInterval).toHaveBeenCalledTimes(1);
    expect(intervalInterface.clearInterval).toHaveBeenCalledTimes(1);

    //если таймер остановлен, то функция остановки не должна вызываться еще раз
    indexView.stopLoadProgress();
    expect(intervalInterface.clearInterval).toHaveBeenCalledTimes(1);
});

test('IndexView.createDOM', function () {
    let DOMelement = document.createElement('div');
    let indexView = indexViewFactory(DOMelement, jss);
    let viewModel = {
        professions: []
    };

    let indexViewDOM = indexView.createDOM(viewModel);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('IndexView.render', function () {
    let DOMelement = document.createElement('div');
    let indexView = indexViewFactory(DOMelement, jss);
    let viewModel = {
        professions: []
    };

    indexView.render(viewModel);

    expect(indexView.getRootElement()).toBe(DOMelement);
    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});
