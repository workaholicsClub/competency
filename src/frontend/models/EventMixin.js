let EventMixin = {
    initEvents: function () {
        this.fakeElement = document.createTextNode(null);
    },

    addEventListener: function () {
        return this.fakeElement.addEventListener.apply(this.fakeElement, arguments);
    },

    removeEventListener: function () {
        return this.fakeElement.removeEventListener.apply(this.fakeElement, arguments);
    },

    dispatchEvent: function () {
        return this.fakeElement.dispatchEvent.apply(this.fakeElement, arguments);
    },

    dispatchModelEvent: function (type) {
        let event = new CustomEvent(type, {detail: this});
        return this.fakeElement.dispatchEvent.call(this.fakeElement, event);
    }
};

module.exports = EventMixin;