const StateMixin = require('./StateMixin');
const EventMixin = require('./EventMixin');

var BaseModel = {
    init: function (props) {
        this.initPropsAndEvents(props);
    },

    initPropsAndEvents: function (props) {
        this.initProps(props);
        this.initEvents();
    },

    set: function (key, value) {
        this.setWithoutEvent(key, value);
        this.dispatchModelEvent('change.'+key);
    },

    setProps: function (newProps) {
        this.setPropsWithoutEvent(newProps);
        this.dispatchModelEvent('change');
    }
};

BaseModel = Object.assign(BaseModel, StateMixin);
BaseModel = Object.assign(BaseModel, EventMixin);

module.exports = BaseModel;