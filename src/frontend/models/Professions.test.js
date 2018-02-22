const BaseModel = require('./Base');
const professionsModelFactory = require('./Professions');
const configMockFactory = require('../mocks/Config');
const professionsMockData = require('../mocks/professions.json');
const getXHRMock = require('../mocks/getXHRMock.fn');

test('ProfessionsModel.interface', function () {
    var professionsModel = professionsModelFactory({});

    expect(BaseModel.isPrototypeOf(professionsModel)).toBeTruthy();
    expect(professionsModel.addEventListener).toBeInstanceOf(Function);
    expect(professionsModel.removeEventListener).toBeInstanceOf(Function);
    expect(professionsModel.dispatchEvent).toBeInstanceOf(Function);
    expect(professionsModel.set).toBeInstanceOf(Function);
    expect(professionsModel.get).toBeInstanceOf(Function);
    expect(professionsModel.load).toBeInstanceOf(Function);
});

test('ProfessionsModel.makeRequestUrl', function () {
    var professionsModel = professionsModelFactory({}, configMockFactory());

    var expectedUrl = '//test.api.url/profession';
    expect(professionsModel.makeRequestUrl()).toEqual(expectedUrl);
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
            try {
                expect(loadHandler).toHaveBeenCalledTimes(1);
                resolve();
            }
            catch (exception) {
                reject(exception);
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
            try {
                expect( professionsModel.get('testField') ).toEqual(expectedValue);
                resolve();
            }
            catch (exception) {
                reject(exception);
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
            try {
                expect( professionsModel.isLoaded() ).toBeTruthy();
                resolve();
            }
            catch (exception) {
                reject(exception);
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
        name: "Веб-разработчик (PHP)",
        competencyCount: 24,
        courseCount: 9,
        timeToFill: 36
    }, {
        code: "tester",
        name: "Тестировщик (Python)",
        competencyCount: 7,
        courseCount: 9,
        timeToFill: 11
    }, {
        "code": "webProjectManager",
        "name": "Менеджер web-проектов",
        "competencyCount": 24,
        "courseCount": 3,
        "timeToFill": 36
    }];

    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            var recievedList = professionsModel.getProfessions();

            try {
                expect(recievedList).toEqual(expectedList);
                resolve();
            } catch (exception) {
                reject(exception);
            }
        });

        professionsModel.load();
    });
});

test('ProfessionsModel.getProfession', function () {
    var xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            var profession = professionsModel.getProfession('tester');

            try {
                expect(profession).toHaveProperty('code');
                expect(profession).toHaveProperty('name');
                expect(profession).toHaveProperty('groups');
                expect(profession.groups).toHaveLength(4);
                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        professionsModel.load();
    });
});

test('ProfessionsModel.getProfession (с данными из свойств)', function () {
    var professionsModel = professionsModelFactory(professionsMockData);
    var profession = professionsModel.getProfession('tester');

    expect(profession).toHaveProperty('code');
    expect(profession).toHaveProperty('name');
    expect(profession).toHaveProperty('groups');
    expect(profession.groups).toHaveLength(4);
});

test('ProfessionsModel.getTimeToFillProfession', function () {
    var professionsModel = professionsModelFactory(professionsMockData);

    expect(professionsModel.getTimeToFillProfession('webDeveloper')).toEqual(36);
    expect(professionsModel.getTimeToFillProfession('tester')).toEqual(11);
});


test('ProfessionsModel.getCompetencies', function () {
    var xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            var competencies = professionsModel.getCompetencies('tester');

            try {
                expect(competencies).toHaveLength(7);

                var competency = competencies[0];
                expect(competency).toHaveProperty('code');
                expect(competency).toHaveProperty('name');
                expect(competency).toHaveProperty('level1');
                expect(competency).toHaveProperty('level2');
                expect(competency).toHaveProperty('level3');
                expect(competency).toHaveProperty('level4');
                expect(competency).toHaveProperty('group');
                expect(competency.group).toHaveProperty('code');
                expect(competency.group).toHaveProperty('name');

                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        professionsModel.load();
    });
});

test('ProfessionsModel.getCompetency', function () {
    var xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    var professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);
    var professionCode = 'tester';
    var expectedCompetencyCode = 'operatingSystems';
    var expectedCompetencyIndex = 3;

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {

            try {
                var competencyAndIndex = professionsModel.getCompetencyAndIndex(professionCode, expectedCompetencyCode);
                var competency = professionsModel.getCompetency(professionCode, expectedCompetencyCode);
                var competencyIndex = professionsModel.getCompetencyIndex(professionCode, expectedCompetencyCode);
                var nonExistantCompetency = professionsModel.getCompetency('tester', 'dataScience');
                var nonExistantProfession = professionsModel.getCompetency('dancer', 'operatingSystems');

                var anyCompetencyDeveloper = professionsModel.getAnyProfessionCompetency('codeQuality');
                var anyCompetencyTester = professionsModel.getAnyProfessionCompetency('probabiltyBasics');

                expect(nonExistantCompetency).toBeFalsy();
                expect(nonExistantProfession).toBeFalsy();
                expect(competencyAndIndex).toHaveProperty('competency');
                expect(competencyAndIndex).toHaveProperty('index');
                expect(competencyAndIndex.competency).toHaveProperty('code');
                expect(competencyAndIndex.competency.code).toEqual(expectedCompetencyCode);
                expect(competencyAndIndex.index).toEqual(expectedCompetencyIndex);
                expect(competency).toHaveProperty('code');
                expect(competency.code).toEqual(expectedCompetencyCode);
                expect(competencyIndex).toEqual(expectedCompetencyIndex);

                expect(anyCompetencyDeveloper).toHaveProperty('code');
                expect(anyCompetencyTester).toHaveProperty('code');
                expect(anyCompetencyDeveloper.code).toEqual('codeQuality');
                expect(anyCompetencyTester.code).toEqual('probabiltyBasics');

                resolve();
            }
            catch (exception) {
                reject(exception);
            }
        });

        professionsModel.load();
    });
});