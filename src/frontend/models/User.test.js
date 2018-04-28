const BaseModel = require('./Base');
const userFactory = require('./User');
const storageMockFactory = require('../mocks/Storage');

test('UserModel interface', function () {
    let userModel = userFactory({});

    expect(BaseModel.isPrototypeOf(userModel)).toBeTruthy();
    expect(userModel.addEventListener).toBeInstanceOf(Function);
    expect(userModel.removeEventListener).toBeInstanceOf(Function);
    expect(userModel.dispatchEvent).toBeInstanceOf(Function);
    expect(userModel.set).toBeInstanceOf(Function);
    expect(userModel.get).toBeInstanceOf(Function);
    expect(userModel.initStorage).toBeInstanceOf(Function);
    expect(userModel.saveData).toBeInstanceOf(Function);
    expect(userModel.loadData).toBeInstanceOf(Function);
    expect(userModel.saveSessionData).toBeInstanceOf(Function);
    expect(userModel.loadSessionData).toBeInstanceOf(Function);
    expect(userModel.bindChangeHandlers).toBeInstanceOf(Function);
    expect(userModel.getId).toBeInstanceOf(Function);
    expect(userModel.getSessionId).toBeInstanceOf(Function);
});

test('UserModel storage', function () {
    let storage = storageMockFactory('user');
    let user = userFactory({}, storage);

    let expectedStorageData = {a: 1, b: 2};

    user.set('a', 1);
    user.set('b', 2);

    expect(storage.load()).toEqual(expectedStorageData);
});

test('UserModel generateUniqueId', function () {
    let user = userFactory({});

    let uniqueId1 = user.generateUniqueId();
    let uniqueId2 = user.generateUniqueId();
    let uniqueId3 = user.generateUniqueId();

    expect(uniqueId1).toHaveLength(36);
    expect(uniqueId2).toHaveLength(36);
    expect(uniqueId3).toHaveLength(36);
    expect(uniqueId1).not.toEqual(uniqueId2);
    expect(uniqueId1).not.toEqual(uniqueId3);
    expect(uniqueId2).not.toEqual(uniqueId3);
});

test('UserModel getId', function () {
    let storage1 = storageMockFactory('user');
    let storage2 = storageMockFactory('user');
    let user1 = userFactory({}, storage1);
    let user2 = userFactory({}, storage2);

    let uniqueId1 = user1.getId();
    let uniqueId2 = user2.getId();

    expect(uniqueId1).toHaveLength(36);
    expect(uniqueId2).toHaveLength(36);
    expect(user1.getId()).toEqual(uniqueId1);
    expect(user2.getId()).toEqual(uniqueId2);
    expect(uniqueId1).not.toEqual(uniqueId2);

    expect(storage1.load()).toEqual({id: uniqueId1});
    expect(storage2.load()).toEqual({id: uniqueId2});
});

test('UserModel getId', function () {
    let storage1 = storageMockFactory('user');
    let storage2 = storageMockFactory('user');
    let sessionStorage1 = storageMockFactory('userSession');
    let sessionStorage2 = storageMockFactory('userSession');
    let user1 = userFactory({}, storage1, sessionStorage1);
    let user2 = userFactory({}, storage2, sessionStorage2);

    let uniqueSessionId1 = user1.getSessionId();
    let uniqueSessionId2 = user2.getSessionId();

    expect(uniqueSessionId1).toHaveLength(36);
    expect(uniqueSessionId2).toHaveLength(36);
    expect(user1.getSessionId()).toEqual(uniqueSessionId1);
    expect(user2.getSessionId()).toEqual(uniqueSessionId2);
    expect(uniqueSessionId1).not.toEqual(uniqueSessionId2);

    expect(sessionStorage1.load()).toEqual({sessionId: uniqueSessionId1});
    expect(sessionStorage2.load()).toEqual({sessionId: uniqueSessionId2});
});

test('UserModel sessionData', function () {
    let storage = storageMockFactory('user');
    let sessionStorage = storageMockFactory('userSession');
    let user = userFactory({}, storage, sessionStorage);

    let userId = user.getId();
    let sessionId = user.getSessionId();
    let savedUserProps = storage.load();
    let savedSessionProps = sessionStorage.load();

    expect(savedUserProps).toHaveProperty('id');
    expect(savedUserProps).not.toHaveProperty('sessionId');
    expect(savedUserProps.id).toEqual(userId);
    expect(savedSessionProps).toHaveProperty('sessionId');
    expect(savedSessionProps).not.toHaveProperty('id');
    expect(savedSessionProps.sessionId).toEqual(sessionId);

    let user2 = userFactory({}, storage, sessionStorage);
    expect(user2.getId()).toEqual(userId);
    expect(user2.getSessionId()).toEqual(sessionId);
});

test('UserModel getSessionPropNames', function () {
    let user = userFactory({});
    expect(user.getSessionPropNames()).toContain('sessionId');
});