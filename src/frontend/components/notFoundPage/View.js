const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

var NotFoundView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
    },

    getRootElement: function () {
        return this.element;
    },

    createDOM: function () {
        var footerView = footerViewFactory(this.stylesManager);

        return h('div#page.container-fluid.mt-3',
                    h('div#head.jumbotron.jumbotron-fluid',
                        h('div.container',
                            h('h1.display-4', 'Страница не найдена')
                        )
                    ),
                    footerView.createDOM()
                );
    },

    render: function (viewModel) {
        var moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;
    }
};

/**
 * @param {HTMLElement} DOMelement
 * @param stylesManager
 * @returns {NotFoundView}
 */
module.exports = function (DOMelement, stylesManager) {
    var instance = Object.create(NotFoundView);
    instance.init(DOMelement, stylesManager);

    return instance;
};