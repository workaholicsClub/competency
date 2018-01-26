const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

var IndexView = {
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
        var loadingTickMs = 1000;
        var ticker = 0;
        var view = this;

        this.loadingIntervalId = this.intervalInterface.setInterval(function () {
            var progressElement = view.getRootElement();
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
            return h('div.col-sm',
                h('div.card',
                    h('div.card-header', profession.name),
                    h('ul.list-group.list-group-flush',
                        h('li.list-group-item', 'Компетенций: '+profession.competencyCount),
                        h('li.list-group-item', 'Курсов: '+profession.courseCount)
                    ),
                    h('div.card-body',
                        h('a.btn.btn-primary', {href: '/test/'+profession.code}, 'Пройти самопроверку (~' +
                            profession.timeToFill + ' мин)')
                    )
                )
            )
        });
    },

    createDOM: function (viewModel) {
        //var styles = this.createStyles();
        var footerView = footerViewFactory(this.stylesManager);

        return h('div#page.container-fluid.mt-3',
                    h('div#head.jumbotron.jumbotron-fluid',
                        h('div.container',
                            h('h1.display-4', 'Убежище N'),
                            h('p.lead', 'Сначала мы поможем понять свой уровень, а потом поможем стать лучше'),
                            h('hr.my-4'),
                            h('p', 'Здесь вы можете следить за развитием собственных компетенций и получать персональные' +
                                ' рекомендации по подходящим онлайн-курсам.'),
                            h('p', 'Выберите профессию, пройдите тестирование, получите рекомендации')
                        )
                    ),
                    h('div#content.container-fluid.mt-3',
                        h('div.row',
                            this.createProfessionCards(viewModel)
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
 * @param intervalInterface
 * @returns {IndexView}
 */
module.exports = function (DOMelement, stylesManager, intervalInterface) {
    if (typeof(intervalInterface) === 'undefined') {
        intervalInterface = global;
    }

    var instance = Object.create(IndexView);
    instance.init(DOMelement, stylesManager, intervalInterface);

    return instance;
};