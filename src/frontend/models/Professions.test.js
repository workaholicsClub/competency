const BaseModel = require('./Base');
const professionsModelFactory = require('./Professions');
const configMockFactory = require('../mocks/Config');
const professionsMockData = require('../mocks/professions.json');
const getXHRMock = require('../mocks/getXHRMock.fn');

test('ProfessionsModel.interface', function () {
    let professionsModel = professionsModelFactory({});

    expect(BaseModel.isPrototypeOf(professionsModel)).toBeTruthy();
    expect(professionsModel.addEventListener).toBeInstanceOf(Function);
    expect(professionsModel.removeEventListener).toBeInstanceOf(Function);
    expect(professionsModel.dispatchEvent).toBeInstanceOf(Function);
    expect(professionsModel.set).toBeInstanceOf(Function);
    expect(professionsModel.get).toBeInstanceOf(Function);
    expect(professionsModel.load).toBeInstanceOf(Function);
});

test('ProfessionsModel.makeRequestUrl', function () {
    let professionsModel = professionsModelFactory({}, configMockFactory());

    let expectedUrl = '//test.api.url/profession';
    expect(professionsModel.makeRequestUrl()).toEqual(expectedUrl);
});

test('ProfessionsModel.load', function () {
    let loadHandler = jest.fn();
    let errorHandler = jest.fn();
    let props = {};
    let xhrMock = getXHRMock('{"test": "123"}');

    let professionsModel = professionsModelFactory(props, configMockFactory(), xhrMock);
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
    let loadHandler = jest.fn();
    let props = {};
    let xhrMock = getXHRMock('{"test": "123"}', true);
    let waitLoadMs = 150;

    let professionsModel = professionsModelFactory(props, configMockFactory(), xhrMock);
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
    let expectedValue = '321abc123';
    let xhrMock = getXHRMock('{"testField": "' + expectedValue + '"}');

    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

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
    let xhrMock = getXHRMock(JSON.stringify(professionsMockData));

    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);
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
    let changeHandler = jest.fn();
    let testValue = '123def321';

    let professionsModel = professionsModelFactory({});
    professionsModel.addEventListener('change', changeHandler);

    professionsModel.setProps({'testField': testValue});

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect( professionsModel.get('testField') ).toBe(testValue);
});

test('ProfessionsModel.getProfessions', function () {
    let xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    let expectedList = [{
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

    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            let recievedList = professionsModel.getProfessions();

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
    let xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            let profession = professionsModel.getProfession('tester');

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
    let professionsModel = professionsModelFactory(professionsMockData);
    let profession = professionsModel.getProfession('tester');

    expect(profession).toHaveProperty('code');
    expect(profession).toHaveProperty('name');
    expect(profession).toHaveProperty('groups');
    expect(profession.groups).toHaveLength(4);
});

test('ProfessionsModel.getTimeToFillProfession', function () {
    let professionsModel = professionsModelFactory(professionsMockData);

    expect(professionsModel.getTimeToFillProfession('webDeveloper')).toEqual(36);
    expect(professionsModel.getTimeToFillProfession('tester')).toEqual(11);
});


function testComptency(competency) {
    expect(competency).toHaveProperty('code');
    expect(competency).toHaveProperty('name');
    expect(competency).toHaveProperty('level1');
    expect(competency).toHaveProperty('level2');
    expect(competency).toHaveProperty('level3');
    expect(competency).toHaveProperty('level4');
    expect(competency).toHaveProperty('group');
    expect(competency.group).toHaveProperty('code');
    expect(competency.group).toHaveProperty('name');
}

test('ProfessionsModel.getCompetencies', function () {
    let xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {
            let competencies = professionsModel.getCompetencies('tester');
            let noProfessionCompetencies = professionsModel.getCompetencies();

            professionsModel.setProfessionCode('tester');
            let setProfessionCompetencies = professionsModel.getCompetencies();

            try {
                expect(competencies).toHaveLength(7);
                testComptency( competencies[0] );

                expect(noProfessionCompetencies).toBeFalsy();

                expect(setProfessionCompetencies).toHaveLength(7);
                testComptency( setProfessionCompetencies[0] );

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
    let xhrMock = getXHRMock(JSON.stringify(professionsMockData));
    let professionsModel = professionsModelFactory({}, configMockFactory(), xhrMock);
    let professionCode = 'tester';
    let expectedCompetencyCode = 'operatingSystems';
    let expectedCompetencyIndex = 3;

    return new Promise(function (resolve, reject) {
        professionsModel.addEventListener('load', function () {

            try {
                let competencyAndIndex = professionsModel.getCompetencyAndIndex(professionCode, expectedCompetencyCode);
                let competency = professionsModel.getCompetency(professionCode, expectedCompetencyCode);
                let competencyIndex = professionsModel.getCompetencyIndex(professionCode, expectedCompetencyCode);
                let nonExistantCompetency = professionsModel.getCompetency('tester', 'dataScience');
                let nonExistantProfession = professionsModel.getCompetency('dancer', 'operatingSystems');

                let anyCompetencyDeveloper = professionsModel.getAnyProfessionCompetency('codeQuality');
                let anyCompetencyTester = professionsModel.getAnyProfessionCompetency('probabiltyBasics');

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

test('ProfessionsModel.professionCode', function () {
    let professionCode = 'webDeveloper';

    /**
     * @type {ProfessionsModel} profession
     */
    let profession = professionsModelFactory({}, configMockFactory());
    expect(profession.getProfessionCode()).toBeUndefined();

    profession.setProfessionCode(professionCode);
    expect(profession.getProfessionCode()).toEqual(professionCode);

    let professionWithCode = professionsModelFactory({}, configMockFactory(), null, professionCode);
    expect(professionWithCode.getProfessionCode()).toEqual(professionCode);
});