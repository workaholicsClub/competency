const BaseModel = require('./Base');
const StorageMixin = require('./StorageMixin');
const cookieStorageFactory = require('../classes/CookieStorage');
const uuid4 = require('../classes/uuid4.fn');

/**
 * @class
 * @alias BaseModel
 */
let UserModel = {
    init: function (props, storage, sessionStorage) {
        this.initPropsAndEvents(props);
        this.initStorage(storage);
        this.initSessionStorage(sessionStorage);

        this.loadData();
        this.loadSessionData();
        this.bindChangeHandlers();
    },

    initSessionStorage: function (sessionStorage) {
        this.sessionStorage = sessionStorage;
    },

    bindChangeHandlers: function () {
        let model = this;
        this.addEventListener('change', function (event) {
            model.saveData.call(model, event);
            model.saveSessionData.call(model, event);
        });
    },

    getSessionPropNames: function () {
        return ['sessionId'];
    },

    saveData: function (event) {
        if (this.storage) {
            let props = this.getProps();
            this.getSessionPropNames().forEach(function (propName) {
                delete props[propName];
            });

            this.storage.save(props);
        }
    },

    refreshExpiryDate: function () {
        this.saveData();
    },

    loadSessionData: function () {
        if (this.storage) {
            let savedAnswers = this.sessionStorage.load();

            if (savedAnswers) {
                this.setPropsWithoutEvent(savedAnswers);
            }
        }
    },

    saveSessionData: function () {
        if (this.sessionStorage) {
            let sessionProps = {};
            this.getSessionPropNames().forEach(function (propName) {
                sessionProps[propName] = this.get(propName);
            }, this);

            this.sessionStorage.save(sessionProps);
        }
    },

    generateUniqueId: function () {
        return uuid4();
    },

    generateSessionId: function () {
        return uuid4();
    },

    getId: function () {
        if (!this.get('id')) {
            let userId = this.generateUniqueId();
            this.set('id', userId);
        }

        this.refreshExpiryDate();
        return this.get('id');
    },

    getSessionId: function () {
        if (!this.get('sessionId')) {
            let sessionId = this.generateSessionId();
            this.set('sessionId', sessionId);
        }

        return this.get('sessionId');
    }
};

let BaseUserModel = Object.assign(Object.create(BaseModel), StorageMixin);
UserModel = Object.assign(BaseUserModel, UserModel);

/**
 * @param props
 * @param storage
 * @param sessionStorage
 * @returns {UserModel}
 */
module.exports = function (props, storage, sessionStorage) {
    if (!props) {
        props = {};
    }

    if (!storage) {
        let storageDays = 365;
        let storageName = 'user';
        storage = cookieStorageFactory(storageName, storageDays);
    }

    if (!sessionStorage) {
        let sessionDays = 30;
        let sessionStorageName = 'sessionStorage';
        sessionStorage = cookieStorageFactory(sessionStorageName, sessionDays);
    }

    let instance = Object.create(UserModel);
    instance.init(props, storage, sessionStorage);

    return instance;
};