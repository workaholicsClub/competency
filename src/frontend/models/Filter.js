const BaseModel = require('./Base');
const StorageMixin = require('./StorageMixin');
const cookieStorageFactory = require('../classes/CookieStorage');

/**
 * @class
 * @alias BaseModel
 */
let FilterModel = {
    init: function (props, storage) {
        this.initPropsAndEvents(props);
        this.initStorage(storage);

        this.loadData();
        this.bindChangeHandlers();
    },

    bindChangeHandlers: function () {
        let model = this;
        this.addEventListener('change', function (event) {
            model.saveData.call(model, event);
        });
    },

};

FilterModel = Object.assign(Object.create(BaseModel), FilterModel);
FilterModel = Object.assign(FilterModel, StorageMixin);

/**
 * @param props
 * @param {string|boolean} storageName
 * @param storage
 * @returns {FilterModel}
 */
module.exports = function (props, storageName, storage) {
    if (!props) {
        props = {};
    }

    if (!storageName) {
        storageName = 'filter';
    }

    if (!storage) {
        storage = cookieStorageFactory(storageName);
    }

    let instance = Object.create(FilterModel);
    instance.init(props, storage);

    return instance;
};