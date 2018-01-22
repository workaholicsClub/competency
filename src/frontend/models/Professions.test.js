const BaseModel = require('./Base');
const professionsModelFactory = require('./Professions');
const configMockFactory = require('../mocks/Config');
const professionsMockData = require('../mocks/professions.json');

function getXHRMock(response, async) {
    return {
        callback: {},
        responseType: 'load',
        responseText: response,
        addEventListener: function (type, callback) {
            this.callback[type] = callback;
        },
        open: function () {},
        send: function () {
            var event = {};
            var xhr = this;
            var loadTimeMs = 50;

            if (async) {
                setTimeout(function () {
                    xhr.callback[xhr.responseType](event);
                }, loadTimeMs);
            }
            else {
                xhr.callback[xhr.responseType](event);
            }
        }
    };
}

test('ProfessionsModel.interface', function () {
    var professionsModel = professionsModelFactory({});

    expect(BaseModel.isPrototypeOf(professionsModel)).toBeTruthy();
    expect(professionsModel.addEventListener).toBeInstanceOf(Function);
    expect(professionsModel.removeEventListener).toBeInstanceOf(Function);
    expect(professionsModel.dispatchEvent).toBeInstanceOf(Function);
});

test('ProfessionsModel.load', function () {
    var loadHandler = jest.fn();
    var errorHandler = jest.fn();
    var props = {};
    var xhrMock = getXHRMock('{"test": "123"}');

    var professionsModel = professionsModelFactory(props, configMockFactory(), xhrMock);
    professionsModel.addEventListener('load', loadHandler);
    professionsModel.addEventListener('loadError', errorHandler);

    xhrMock.responseType = 'load';
    professionsModel.load();
    expect(loadHandler).toHaveBeenCalledTimes(1);

    xhrMock.responseType = 'error';
    professionsModel.load();
    expect(errorHandler).toHaveBeenCalledTimes(1);
});

test('ProfessionsModel.load (двойной вызов)', function () {
    var loadHandler = jest.fn();
    var props = {};
    var xhrMock = getXHRMock('{"test": "123"}', true);
    var waitLoadMs = 150;

    var professionsModel = professionsModelFactory(props, configMockFactory(), xhrMock);
    professionsModel.addEventListener('load', loadHandler);
    xhrMock.responseType = 'load';

    return new Promise(function (resolve, reject) {
        professionsModel.load();
        professionsModel.load();

        setTimeout(function () {
            //expect не работает
            var callsCount = loadHandler.mock.calls.length;
            if (callsCount === 1) {
                resolve();
            }
            else {
                reject('loadHandler был вызван '+callsCount+' раз(а), а нужно 1');
            }
        }, waitLoadMs);
    });
});

test('ProfessionsModel.loadAndSetFields', function () {
    var expectedValue = '321abc123';
    var xhrMock = getXHRMock('{"testField": "' + expectedValue + '"}');

    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            var recievedValue = professionsModel.get('testField');

            if (recievedValue === expectedValue) {
                resolve();
            }
            else {
                reject('testField: ' + recievedValue + ' (revieved) !== ' + expectedValue + ' (expected)');
            }
        });

        professionsModel.load();
    });
});

test('ProfessionsModel.isLoaded', function () {
    var xhrMock = getXHRMock(JSON.stringify(professionsMockData));

    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);
    expect( professionsModel.isLoaded() ).toBeFalsy();

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            if ( professionsModel.isLoaded() === true) {
                resolve();
            }
            else {
                reject('ProfessionsModel.isLoaded() !== true');
            }
        });

        professionsModel.load();
    });

});


test('ProfessionsModel.setProps', function () {
    var changeHandler = jest.fn();
    var testValue = '123def321';

    var professionsModel = professionsModelFactory({});
    professionsModel.addEventListener('change', changeHandler);

    professionsModel.setProps({'testField': testValue});

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect( professionsModel.get('testField') ).toBe(testValue);
});

test('ProfessionsModel.getProfessions', function () {
    var xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    var expectedList = [{
        code: "webDeveloper",
        name: "Веб-разработчик (PHP)"
    }, {
        code: "tester",
        name: "Тестировщик (Python)"
    }];

    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            var recievedList = professionsModel.getProfessions();
            var expectedListCompare = JSON.stringify(expectedList);
            var recievedListCompare = JSON.stringify(recievedList);

            if ( recievedListCompare === expectedListCompare ) {
                resolve();
            }
            else {
                reject('getProfessions(): ' + recievedListCompare + ' (revieved) !== ' + expectedListCompare + ' (expected)')
            }
        });

        professionsModel.load();
    });
});
