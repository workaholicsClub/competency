const StorageMixin = require('./StorageMixin');
const StateMixin = require('./StateMixin');

function getJestStorageMock() {
    return {
        init: jest.fn(),
        save: jest.fn(),
        load: jest.fn()
    }
}

function getStorageModel(storageMock) {
    if (!storageMock) {
        storageMock = getJestStorageMock();
    }

    let storageModel = Object.create(StorageMixin);
    storageModel = Object.assign(storageModel, StateMixin);

    storageModel.initStorage(storageMock);
    storageModel.initProps({});

    return storageModel;
}

test('StorageMixin.interface', function () {
    let storageModel = getStorageModel();

    expect(storageModel.initStorage).toBeInstanceOf(Function);
    expect(storageModel.saveData).toBeInstanceOf(Function);
    expect(storageModel.loadData).toBeInstanceOf(Function);
    expect(storageModel.getProps).toBeInstanceOf(Function);
    expect(storageModel.setPropsWithoutEvent).toBeInstanceOf(Function);
});

test('StorageMixin loadData и saveData', function () {
    let storageMock = getJestStorageMock();
    let storageModel = getStorageModel(storageMock);

    storageModel.loadData();
    expect(storageMock.load).toHaveBeenCalledTimes(1);
    expect(storageMock.save).not.toHaveBeenCalled();

    storageModel.saveData();
    expect(storageMock.save).toHaveBeenCalledTimes(1);
    expect(storageMock.load).toHaveBeenCalledTimes(1);
});