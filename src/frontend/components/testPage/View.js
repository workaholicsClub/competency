const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

let TestView = {
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

    createProgressBar: function (viewModel) {
        let humanIndex = viewModel.competencyIndex+1;

        return h('div#progress-bar.row.mt-5',
            h('div.col-md-12',
                h('h3', 'Шаг ' + humanIndex + ' из ' + viewModel.competenciesCount + ': ' + viewModel.currentCompetency.name)
            )
        );
    },

    createNavigationButtons: function (viewModel) {
        let isFinalStep = viewModel.nextCompetency === false;

        return isFinalStep
            ? h('a#next-button.btn.btn-primary.btn-lg', {href: viewModel.resultsLink, attrs: {role: 'button'}}, 'Готово')
            : [
                h('a#skip-button.btn.btn-outline-secondary.btn-sm.mr-1', {href: viewModel.nextCompetencyLink}, 'Пропустить'),
                h('a#next-button.btn.btn-primary.btn-lg', {href: viewModel.nextCompetencyLink, attrs: {role: 'button'}}, 'Далее')
            ];
    },

    getEvaluationContainer: function () {
        return this.element.querySelector('#content');
    },

    createDOM: function (viewModel, evaluationBlock) {
        let footerView = footerViewFactory(this.stylesManager);
        return h('div#page.container-fluid.mt-3',
                    h('div#head.row',
                        h('div.col-md-12',
                            h('div.page-header',
                                h('h1.display-4', viewModel.profession.name),
                                h('h2', viewModel.competencyGroup.name)
                            )
                        )
                    ),
                    this.createProgressBar(viewModel),
                    h('div#content.row'),
                    h('div#buttons.row.mt-5',
                        h('div.col.text-left',
                            h('a.btn.btn-outline-secondary.btn-sm', 'К списку компетенций', {href: viewModel.resultsLink})
                        ),
                        h('div.col.text-right', this.createNavigationButtons(viewModel))
                    ),
                    footerView.createDOM()
                );
    },

    render: function (viewModel) {
        let moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = '';
        this.element.appendChild(moduleElement);
    }
};

/**
 * @param {HTMLElement} DOMelement
 * @param stylesManager
 * @returns {TestView}
 */
module.exports = function (DOMelement, stylesManager) {
    let instance = Object.create(TestView);
    instance.init(DOMelement, stylesManager);

    return instance;
};