const EventMixin = require('./EventMixin');

test('EventMixin.interface', function () {
    var events = Object.create(EventMixin);

    expect(events.addEventListener).toBeInstanceOf(Function);
    expect(events.removeEventListener).toBeInstanceOf(Function);
    expect(events.dispatchEvent).toBeInstanceOf(Function);
});

test('EventMixin.init', function () {
    var events = Object.create(EventMixin);
    events.initEvents();
    expect(events.fakeElement).toBeInstanceOf(Text);
});

test('EventMixin.events', function () {
    var events = Object.create(EventMixin);
    events.initEvents();

    var eventHandler = jest.fn();

    events.addEventListener('test', eventHandler);

    var testEvent = new Event('test');
    events.dispatchEvent(testEvent);
    expect(eventHandler).toBeCalled();

    events.removeEventListener('test', eventHandler);
    events.dispatchEvent(testEvent);
    expect(eventHandler).toHaveBeenCalledTimes(1);
});

test('EventMixin.modelEvent', function () {
    var events = Object.create(EventMixin);
    events.initEvents();

    var eventHandler = jest.fn();

    events.addEventListener('test', eventHandler);
    events.dispatchModelEvent('test');
    expect(eventHandler).toBeCalled();
});