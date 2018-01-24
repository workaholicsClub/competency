const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

var ResultView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
    },

    /**
     * @returns {HTMLElement}
     */
    getRootElement: function () {
        return this.element;
    },

    createResults: function (viewModel) {
        return h('div.list-group',
            viewModel.competencies.map(function (competency) {
                return h('a.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', competency.name,
                    h('span.badge.badge-primary.badge-pill', competency.rating)
                )
            })
        );
    },

    createSubscribeForm: function () {

    },

    createDOM: function (viewModel) {
        var footerView = footerViewFactory(this.stylesManager);
        return h('div#page.container-fluid.mt-3',
            h('div#head.row',
                h('div.col-md-12',
                    h('div.page-header',
                        h('h1.display-4', 'Результаты самооценки')
                    )
                )
            ),
            h('div#content.row',
                h('div.col-md-12',
                    this.createResults(viewModel)
                )
            ),
            h('div#buttons.row.mt-5',
                h('div.col-md-12.text-centered', this.createSubscribeForm())
            ),
            footerView.createDOM()
        );
    },

    render: function (viewModel) {
        var moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;
    }
};

module.exports = function (element, stylesManager) {
    var instance = Object.create(ResultView);
    instance.init(element, stylesManager);
    return instance;
};