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

    markLevelCompleted: function (selectElement) {
        var completedCard = selectElement.closest('.card');

        completedCard.classList.add('bg-success');
        completedCard.classList.add('text-white');
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
        var options = [
            'Оцените себя',
            'Никак не соответствую',
            'Почти не соответствую',
            'Частично соответствую',
            'Почти соответствую',
            'Полностью соответствую'
        ];

        return viewModel.levels.map(function (level, index) {
            var humanIndex = index+1;

            return h('div.col-sm',
                h('div.card'+(level.isAnswered ? '.bg-success.text-white': ''),
                    h('div.card-header', 'Уровень ' + humanIndex),
                    h('div.card-body',
                        h('div.form-group',
                            h('select#levelSelect' + humanIndex + '.form-control.level-select', {name: 'level'+humanIndex},
                                options.map(function (optionText, optionIndex) {
                                    var optionParams = {attrs: {value: optionIndex}};
                                    var placeholderSelected = level.answer === false && optionIndex === 0;

                                    if (placeholderSelected || level.answer === optionIndex) {
                                        optionParams.attrs['selected'] = 'selected';
                                    }

                                    if (optionIndex === 0) {
                                        optionParams['disabled'] = true;
                                    }

                                    return h('option', optionText, optionParams);
                                })
                            )
                        ),
                        h('p', level.text)
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
            ? h('a#next-button.btn.btn-primary.btn-lg', {href: viewModel.resultsLink, attrs: {role: 'button'}}, 'Готово')
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
                        h('div.col.text-left',
                            h('a.btn.btn-outline-secondary.btn-sm', 'Посмотреть результаты', {href: viewModel.resultsLink})
                        ),
                        h('div.col.text-right', this.createNavigationButtons(viewModel))
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