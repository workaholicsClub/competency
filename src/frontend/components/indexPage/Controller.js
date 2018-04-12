const BaseController = require('../base/Controller');

let IndexController = {
    init: function (view, professionsModel) {
        this.view = view;
        this.professionsModel = professionsModel;
        this.element = view.getRootElement();
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.professionsModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.view.startLoadProgress();
            this.professionsModel.load();
        }
    },

    renderIndexPageAfterLoad: function () {
        let modelView = {
            'professions': this.professionsModel.getProfessions()
        };

        this.view.stopLoadProgress();
        this.view.render(modelView);
    }
};

IndexController = Object.assign(Object.create(BaseController), IndexController);

/**
 * @param view
 * @param professionsModel
 * @returns {IndexController}
 */
module.exports = function (view, professionsModel) {
    let instance = Object.create(IndexController);
    instance.init(view, professionsModel);

    return instance;
};