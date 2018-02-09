const BaseController = require('../base/Controller');

var NotFoundController = {
    init: function (view) {
        this.view = view;
    },

    renderNotFoundPage: function () {
        this.view.render();
    }
};

NotFoundController = Object.assign(Object.create(BaseController), NotFoundController);

/**
 * @param view
 * @returns {NotFoundController}
 */
module.exports = function (view) {
    var instance = Object.create(NotFoundController);
    instance.init(view);

    return instance;
};