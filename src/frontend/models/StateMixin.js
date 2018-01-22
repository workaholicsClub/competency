function deepClone(source) {
    //TODO eval is evil
    return JSON.parse(JSON.stringify(source));
}

function isObject(param) {
    return typeof(param) === 'object';
}

var StateMixin = {
    initProps: function (props) {
        this.props = isObject(props)
            ? deepClone(props)
            : {};
    },

    setWithoutEvent: function (key, value) {
        this.props[key] = isObject(value)
            ? deepClone(value)
            : value;
    },

    get: function (key) {
        return isObject(this.props[key])
            ? deepClone(this.props[key])
            : this.props[key] || null;
    },

    has: function (key) {
        return typeof(this.props[key]) !== 'undefined';
    },

    setPropsWithoutEvent: function (newProps) {
        var isInvalidProps = !(isObject(newProps) && Object.keys(newProps).length > 0);

        if (isInvalidProps) {
            throw new Error('Объект свойств задан неверно');
        }

        Object.keys(newProps).forEach(function (key) {
            var value = newProps[key];
            if (value !== null) {
                this.setWithoutEvent(key, value);
            }
        }, this);
    }
};

module.exports = StateMixin;