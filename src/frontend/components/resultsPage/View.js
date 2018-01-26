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

    getRecomendationsContainer: function () {
        return this.element.querySelector('#recomendationsContainer');
    },

    noResults: function () {
        return h('div.list-group',
            h('span.list-group-item', 'Результатов оценки нет')
        );
    },

    createResults: function (viewModel) {
        if (viewModel.competencies.length === 0) {
            return this.noResults();
        }

        return h('div.list-group',
            viewModel.competencies.map(function (competency) {
                return h('a.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', competency.name,
                    h('span.badge.badge-primary.badge-pill', competency.rating)
                )
            })
        );
    },

    createHiddenInputs: function (viewModel) {
        return viewModel.competencies.map(function (competency) {
            return h('input', {name: 'competency[' + competency.code + ']', type: 'hidden', attrs: {value: '1'}})
        });
    },

    createSubscribeForm: function (viewModel) {
        return h('form',
            this.createHiddenInputs(viewModel),
            h('div.form-row.align-items-center',
                h('div.col-auto',
                    h('label.sr-only', {for: 'emailInput'}, 'Электропочта'),
                    h('div.input-group.mb-2',
                        h('div.input-group-prepend',
                            h('div.input-group-text', '@')
                        ),
                        h('input#emailInput.form-control', {name: 'email', type: 'email', placeholder: 'Электропочта'})
                    )
                ),
                h('div.col-auto',
                    h('div.input-group.mb-2',
                        h('select#remindSelect.form-control', {name: 'remind'},
                            h('option', 'Напомнить мне пройти еще раз', {disabled: true, attrs: {selected: 'selected', value: '0'}}),
                            h('option', 'Через 1 месяц', {attrs: {value: '1'}}),
                            h('option', 'Через 2 месяца', {attrs: {value: '2'}}),
                            h('option', 'Через полгода', {attrs: {value: '6'}}),
                            h('option', 'Не напоминать', {attrs: {value: '0'}})
                        )
                    )
                ),
                h('div.col-auto',
                    h('button.btn.btn-primary.mb-2', {type: 'submit'}, 'Сохранить результат')
                )
            )
        );
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
            h('div#buttons.row.mt-3',
                h('div.col-md-12.text-centered', this.createSubscribeForm(viewModel))
            ),
            h('div#content.row.mt-5',
                h('div.col-md-12',
                    h('h2.display-6', 'Навыки'),
                    this.createResults(viewModel)
                )
            ),
            h('div#recomendations.row.mt-5',
                h('div.col-md-12',
                    h('h2.display-6', 'Рекомендуемые курсы'),
                    h('div#recomendationsContainer')
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

module.exports = function (element, stylesManager) {
    var instance = Object.create(ResultView);
    instance.init(element, stylesManager);
    return instance;
};