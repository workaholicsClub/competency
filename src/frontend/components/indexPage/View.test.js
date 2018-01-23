const indexViewFactory = require('./View');

const jss = require('jss').default;
const sleep = require('../../mocks/sleep.fn.js');

test('IndexView.loadingInterval', function () {
    var DOMelement = document.createElement('div');
    var milisecondsToCatchOneTick = 1000;
    var testIntervalId = 1;
    var intervalInterface = {
        setInterval: jest.fn().mockReturnValue(testIntervalId),
        clearInterval: jest.fn()
    };

    var indexView = indexViewFactory(DOMelement, jss, intervalInterface);
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
    var DOMelement = document.createElement('div');
    var indexView = indexViewFactory(DOMelement, jss);
    var viewModel = {
        professions: []
    };

    var indexViewDOM = indexView.createDOM(viewModel);
    expect(indexViewDOM).toBeInstanceOf(HTMLElement);
});

test('IndexView.render', function () {
    var DOMelement = document.createElement('div');
    var indexView = indexViewFactory(DOMelement, jss);
    var viewModel = {
        professions: []
    };

    indexView.render(viewModel);

    expect(indexView.getRootElement()).toBe(DOMelement);
    //expect(mainView.queryVehicleDataElement()).toBeInstanceOf(HTMLElement);
    //expect(mainView.queryNumberInput()).toBeInstanceOf(HTMLInputElement);

    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});
