const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

let IndexView = {
    init: function (element, stylesManager, intervalInterface) {
        this.element = element;
        this.stylesManager = stylesManager;

        this.intervalInterface = intervalInterface || window || global;
        this.loadingIntervalId = null;
    },

    createStyles: function () {
        return this.stylesManager.createStyleSheet({
        }).attach();
    },

    getRootElement: function () {
        return this.element;
    },

    startLoadProgress: function () {
        let loadingTickMs = 1000;
        let ticker = 0;
        let view = this;

        this.loadingIntervalId = this.intervalInterface.setInterval(function () {
            let progressElement = view.getRootElement();
            progressElement.innerHTML = ticker;
            ticker++;
        }, loadingTickMs);
    },

    stopLoadProgress: function () {
        if (this.loadingIntervalId) {
            this.intervalInterface.clearInterval(this.loadingIntervalId);
            this.loadingIntervalId = null;
        }
    },

    createProfessionCards: function (viewModel) {
        return viewModel.professions.map(function (profession) {
            return h('div.card.mb-3',
                h('div.card-header', profession.name),
                h('ul.list-group.list-group-flush',
                    h('li.list-group-item', 'Компетенций: '+profession.competencyCount),
                ),
                h('div.card-body',
                    h('a.btn.btn-primary', {href: '/test/'+profession.code}, 'Проверить навыки')
                )
            )
        });
    },

    createCourseSearchCards: function (viewModel) {
        return viewModel.professions.map(function (profession) {
            return h('div.card.mb-3',
                h('div.card-header', profession.name),
                h('ul.list-group.list-group-flush',
                    h('li.list-group-item', 'Курсов: '+profession.courseCount)
                ),
                h('div.card-body',
                    h('a.btn.btn-primary', {href: '/courses/'+profession.code}, 'Подобрать курсы')
                )
            )
        });
    },

    createDOM: function (viewModel) {
        let footerView = footerViewFactory(this.stylesManager);
        let footer = footerView.createDOM();

        return h('div#page.container-fluid.mt-3',
                    h('div#head.jumbotron.jumbotron-fluid',
                        h('div.container',
                            h('h1.display-4', 'Развивака'),
                            h('p.lead', 'Сначала мы поможем понять свой уровень, а потом поможем стать лучше'),
                            h('hr.my-4'),
                            h('p', 'Здесь вы можете следить за развитием собственных компетенций и получать персональные' +
                                ' рекомендации по подходящим онлайн-курсам.')
                        )
                    ),
                    h('div#content.row.mt-3',
                        h('div.col',
                            h('div', h('h2.display-5', 'Поиск курсов')),
                            h('div', this.createCourseSearchCards(viewModel)),
                        ),
                        h('div.col',
                            h('div', h('h2.display-5', 'Проверка навыков')),
                            h('div', this.createProfessionCards(viewModel))
                        )
                    ),
                    footer
                );
    },

    render: function (viewModel) {
        let moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;
    }
};

/**
 * @param {HTMLElement} DOMelement
 * @param stylesManager
 * @param intervalInterface
 * @returns {IndexView}
 */
module.exports = function (DOMelement, stylesManager, intervalInterface) {
    if (typeof(intervalInterface) === 'undefined') {
        intervalInterface = global;
    }

    let instance = Object.create(IndexView);
    instance.init(DOMelement, stylesManager, intervalInterface);

    return instance;
};