var BaseController = {
    init: function (view, model) {
        this.view = view;
        this.model = model;
        this.events = [];
    },

    handleEvent: function (incomingEvent) {
        var contextForEventHandler = this;

        this.events.forEach(function (controllerEvent) {
            /**
             * @param {Object} controllerEvent
             * @param {string[]} controllerEvent.types
             * @param {EventTarget} controllerEvent.target
             * @param {Function} controllerEvent.handler
             */

            var controllerEventHasType = controllerEvent.types.indexOf(incomingEvent.type) !== -1;
            var isModelEvent = incomingEvent instanceof CustomEvent;
            var controllerEventHasSameTarget = incomingEvent.currentTarget === controllerEvent.target;

            if (controllerEventHasType && (controllerEventHasSameTarget || isModelEvent)) {
                controllerEvent.handler.call(contextForEventHandler, incomingEvent);
            }
        });
    },

    bindEvents: function () {
        var eventListener = this;

        this.events.forEach(function (event) {
            /**
             * @param {Object} event
             * @param {string[]} event.types
             * @param {EventTarget} event.target
             * @param {Function} event.handler
             */

            event.types.forEach(function (type) {
                event.target.addEventListener(type, eventListener);
            });
        });
    }
};

module.exports = BaseController;