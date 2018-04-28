const uuid4 = require('./uuid4.fn');

function isUuidValid(uuid) {
    let isLengthValid = uuid.length === 36;
    let isFormatValid = /[0-9a-z]{8}\-[0-9a-z]{4}\-4[0-9a-z]{3}\-[0-9a-z]{4}\-[0-9a-z]{12}/i.test(uuid);

    return isLengthValid && isFormatValid;
}

test('uuid4', function () {
    let uuid1 = uuid4();
    let uuid2 = uuid4();

    expect(isUuidValid(uuid1)).toBeTruthy();
    expect(isUuidValid(uuid2)).toBeTruthy();
    expect(uuid1).not.toEqual(uuid2);
});