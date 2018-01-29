const cookieStorageFactory = require('./CookieStorage');

test('CookieStorage.save и load', function () {
    var storage = cookieStorageFactory('testName');
    var expectedCases = [
        123,
        "testTest",
        123.45,
        {test: 'object'}
    ];

    expectedCases.forEach(function (expectedData) {
        storage.save(expectedData);
        var loadedData = storage.load();
        expect(loadedData).toEqual(expectedData);
    });
});