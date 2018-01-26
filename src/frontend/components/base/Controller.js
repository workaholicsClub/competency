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
            var controllerEventHasSameTarget = false;

            if (isModelEvent) {
                var targetModel = incomingEvent.detail;
                controllerEventHasSameTarget = targetModel === controllerEvent.target;
            }
            else {
                if (controllerEvent.target instanceof NodeList || controllerEvent.target instanceof Array) {
                    controllerEvent.target.forEach(function (target) {
                        controllerEventHasSameTarget = target === incomingEvent.currentTarget || controllerEventHasSameTarget;
                    });
                }
                else {
                    controllerEventHasSameTarget = incomingEvent.currentTarget === controllerEvent.target;
                }
            }

            if (controllerEventHasType && controllerEventHasSameTarget) {
                controllerEvent.handler.call(contextForEventHandler, incomingEvent);
            }
        });
    },

    /**
     * @param {EventTarget[]} events
     */
    bindEvents: function (events) {
        var eventListener = this;

        if (!events) {
            events = this.events;
        }

        events.forEach(function (event) {
            /**
             * @param {Object} event
             * @param {string[]} event.types
             * @param {EventTarget|EventTarget[]|NodeList} event.target
             * @param {Function} event.handler
             */

            event.types.forEach(function (type) {

                if (event.target instanceof NodeList || event.target instanceof Array) {
                    event.target.forEach(function (target) {
                        target.addEventListener(type, eventListener);
                    });
                }
                else {
                    event.target.addEventListener(type, eventListener);
                }

            });
        });
    }
};

module.exports = BaseController;