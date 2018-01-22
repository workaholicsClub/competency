const mainViewFactory = require('./View');

const jss = require('jss').default;
const sleep = require('../../mocks/sleep.fn.js');

function createMainView(DOMelement, intervalInterface) {
    return mainViewFactory(DOMelement, jss, intervalInterface);
}

test('MainView.loadingInterval', function () {
    var DOMelement = document.createElement('div');
    var milisecondsToCatchOneTick = 1000;
    var testIntervalId = 1;
    var intervalInterface = {
        setInterval: jest.fn().mockReturnValue(testIntervalId),
        clearInterval: jest.fn()
    };

    var mainView = createMainView(DOMelement, intervalInterface);
    mainView.startLoadProgress();

    sleep(milisecondsToCatchOneTick);

    mainView.stopLoadProgress();
    expect(intervalInterface.setInterval).toHaveBeenCalledTimes(1);
    expect(intervalInterface.clearInterval).toHaveBeenCalledTimes(1);

    //если таймер остановлен, то функция остановки не должна вызываться еще раз
    mainView.stopLoadProgress();
    expect(intervalInterface.clearInterval).toHaveBeenCalledTimes(1);
});

test('MainView.createDOM', function () {
    var DOMelement = document.createElement('div');
    var mainView = createMainView(DOMelement);

    var mainViewDOM = mainView.createDOM({});
    expect(mainViewDOM).toBeInstanceOf(HTMLElement);
});

test('MainView.render', function () {
    var DOMelement = document.createElement('div');
    var mainView = createMainView(DOMelement);
    var viewModel = {};

    mainView.render(viewModel);

    expect(mainView.getRootElement()).toBe(DOMelement);
    //expect(mainView.queryVehicleDataElement()).toBeInstanceOf(HTMLElement);
    //expect(mainView.queryNumberInput()).toBeInstanceOf(HTMLInputElement);

    expect(DOMelement.innerHTML.indexOf('null')).toBe(-1);
});
