const BaseModel = require('./Base');

/**
 * @class
 * @alias BaseModel
 */
let FilterModel = {
};

FilterModel = Object.assign(Object.create(BaseModel), FilterModel);

/**
 * @param props
 * @returns {FilterModel}
 */
module.exports = function (props) {
    if (!props) {
        props = {};
    }

    let instance = Object.create(FilterModel);
    instance.init(props);

    return instance;
};