const BaseModel = require('./Base');

let FilterModel = {
};

FilterModel = Object.assign(Object.create(BaseModel), FilterModel);

module.exports = function (props) {
    if (!props) {
        props = {};
    }

    let instance = Object.create(FilterModel);
    instance.init(props);

    return instance;
};