const BaseController = require('../base/Controller');

var IndexController = {
    init: function (view, professionsModel) {
        this.view = view;
        this.filterModel = professionsModel;
        this.element = view.getRootElement();
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.filterModel, handler: this.renderIndexPageAfterLoad}
        ];

        this.bindEvents();
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.filterModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.view.startLoadProgress();
            this.filterModel.load();
        }
    },

    renderIndexPageAfterLoad: function () {
        var modelView = {
            'professions': this.filterModel.getProfessions()
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
    var instance = Object.create(IndexController);
    instance.init(view, professionsModel);

    return instance;
};