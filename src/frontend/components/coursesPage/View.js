const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

let CoursesView = {
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

    /**
     * @returns {HTMLElement}
     */
    getCoursesContainer: function () {
        return this.element.querySelector('#coursesContainer');
    },

    getFilterContainer: function () {
        return this.element.querySelector('#filterContainer');
    },

    createDOM: function (viewModel) {
        let footerView = footerViewFactory(this.stylesManager);
        return h('div#page.container-fluid.mt-3',
            h('div#head.row',
                h('div.col-md-12',
                    h('div.page-header',
                        h('h1.display-4', 'Поиск курсов'),
                        h('a', 'на главную', {href: '/'})
                    )
                )
            ),
            h('div#recomendations.row.mt-5',
                h('div.col-md-3',
                    h('div#filterContainer')
                ),
                h('div.col-md-9',
                    h('div#coursesContainer')
                )
            ),
            footerView.createDOM()
        );
    },

    render: function (viewModel) {
        let moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;
    }
};

module.exports = function (element, stylesManager) {
    let instance = Object.create(CoursesView);
    instance.init(element, stylesManager);
    return instance;
};