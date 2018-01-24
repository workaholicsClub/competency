const h = require('hyperscript');
const footerViewFactory = require('../footer/View');

var TestView = {
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
     * @param levelIndex
     * @returns {Element}
     */
    getLevelSelect: function (levelIndex) {
        return this.element.querySelector('#levelSelect'+levelIndex);
    },

    /**
     * @returns {NodeList}
     */
    getAllLevelSelects: function () {
        return this.element.querySelectorAll('.level-select');
    },

    getLevelAnswers: function () {
        var answers = [];

        this.getAllLevelSelects().forEach(function (selectElement) {
            answers.push( parseInt(selectElement.value) );
        });

        return answers;
    },

    createLevels: function (viewModel) {
        return viewModel.levels.map(function (levelText, index) {
            var humanIndex = index+1;

            return h('div.col-sm',
                h('div.card',
                    h('div.card-header', 'Уровень ' + humanIndex),
                    h('div.card-body',
                        h('div.form-group',
                            h('select#levelSelect' + humanIndex + '.form-control.level-select', {name: 'level'+humanIndex},
                                h('option', 'Оцените себя', {disabled: true, attrs: {selected: 'selected', value: '0'}}),
                                h('option', 'Никак не соотвествую', {attrs: {value: '1'}}),
                                h('option', 'Почти не соотвествую', {attrs: {value: '2'}}),
                                h('option', 'Частично соотвествую', {attrs: {value: '3'}}),
                                h('option', 'Почти соотвествую', {attrs: {value: '4'}}),
                                h('option', 'Полностью соотвествую', {attrs: {value: '5'}})
                            )
                        ),
                        h('p', levelText)
                    )
                )
            )
        });
    },

    createProgressBar: function (viewModel) {
        var humanIndex = viewModel.competencyIndex+1;

        return h('div#progress-bar.row.mt-5',
            h('div.col-md-12',
                h('h3', 'Шаг ' + humanIndex + ' из ' + viewModel.competenciesCount + ': ' + viewModel.currentCompetency.name)
            )
        );
    },

    createNavigationButtons: function (viewModel) {
        var isFinalStep = viewModel.nextCompetency === false;

        return isFinalStep
            ? h('a#next-button.btn.btn-primary.btn-lg', {href: '/results', attrs: {role: 'button'}}, 'Готово')
            : [
                h('a#skip-button.btn.btn-outline-secondary.btn-sm.mr-1', {href: viewModel.nextCompetencyLink}, 'Пропустить'),
                h('a#next-button.btn.btn-primary.btn-lg', {href: viewModel.nextCompetencyLink, attrs: {role: 'button'}}, 'Далее')
            ];
    },

    createDOM: function (viewModel) {
        var footerView = footerViewFactory(this.stylesManager);
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
                    h('div#content.row',
                        this.createLevels(viewModel)
                    ),
                    h('div#buttons.row.mt-5',
                        h('div.col-md-12.text-right', this.createNavigationButtons(viewModel))
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
 * @returns {TestView}
 */
module.exports = function (DOMelement, stylesManager) {
    var instance = Object.create(TestView);
    instance.init(DOMelement, stylesManager);

    return instance;
};