let BaseController = {
    init: function (view, model) {
        this.view = view;
        this.model = model;
        this.events = [];
    },

    handleEvent: function (incomingEvent) {
        let contextForEventHandler = this;

        this.events.forEach(function (controllerEvent) {
            /**
             * @param {Object} controllerEvent
             * @param {string[]} controllerEvent.types
             * @param {EventTarget} controllerEvent.target
             * @param {Function} controllerEvent.handler
             */

            let controllerEventHasType = controllerEvent.types.indexOf(incomingEvent.type) !== -1;
            let isModelEvent = incomingEvent instanceof CustomEvent;
            let controllerEventHasSameTarget = false;

            if (isModelEvent) {
                let targetModel = incomingEvent.detail;
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
     * @param {EventTarget[]=} events
     */
    bindEvents: function (events) {
        let eventListener = this;

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
    },

    /**
     * @param {int} eventIndex
     * @param {boolean} removeListenerOnly
     */
    removeEvent: function (eventIndex, removeListenerOnly) {
        let eventListener = this;

        if (typeof (removeListenerOnly) !== 'boolean') {
            removeListenerOnly = false;
        }

        let removeEventFromArray = !removeListenerOnly;
        let oldEvent = this.events[eventIndex];

        oldEvent.types.forEach(function (type) {
            if (oldEvent.target instanceof NodeList || oldEvent.target instanceof Array) {
                oldEvent.target.forEach(function (target) {
                    target.removeEventListener(type, eventListener);
                });
            }
            else {
                oldEvent.target.removeEventListener(type, eventListener);
            }
        });

        if (removeEventFromArray) {
            this.events.splice(eventIndex, 1);
        }
    },

    replaceEvent: function (eventIndex, newEvent) {
        let removeListenerOnly = true;
        this.removeEvent(eventIndex, removeListenerOnly);

        this.events[eventIndex] = newEvent;
        this.bindEvents([newEvent]);
    }
};

module.exports = BaseController;