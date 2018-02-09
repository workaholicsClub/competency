const h = require('hyperscript');
const footerViewFactory = require('../footer/View');
const bsn = require('bootstrap.native/dist/bootstrap-native-v4');

var ResultView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
        this.successModalInstance = false;
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
    getRecomendationsContainer: function () {
        return this.element.querySelector('#recomendationsContainer');
    },

    /**
     * @returns {HTMLElement}
     */
    getSaveButton: function () {
        return this.element.querySelector('#saveResult');
    },

    /**
     * @returns {HTMLFormElement}
     */
    getSubscribeForm: function () {
        return this.element.querySelector('#subscribeForm');
    },

    getSuccessModal: function () {
        return this.element.querySelector('#successModal');
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
                    h('span.badge.badge-primary.badge-pill', competency.ratingPercent+'%')
                )
            })
        );
    },

    createHiddenInputs: function (viewModel) {
        return viewModel.competencies.map(function (competency) {
            return h('input', {name: 'competency[' + competency.code + ']', type: 'hidden', attrs: {value: competency.rating}})
        });
    },

    createSubscribeForm: function (viewModel) {
        return h('form#subscribeForm',
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
                        h('select#remindSelect.form-control', {name: 'remindMonths'},
                            h('option', 'Напомнить мне пройти еще раз', {disabled: true, attrs: {selected: 'selected', value: '0'}}),
                            h('option', 'Через 1 месяц', {attrs: {value: '1'}}),
                            h('option', 'Через 2 месяца', {attrs: {value: '2'}}),
                            h('option', 'Через полгода', {attrs: {value: '6'}}),
                            h('option', 'Не напоминать', {attrs: {value: '0'}})
                        )
                    )
                ),
                h('div.col-auto',
                    h('div.input-group.mb-2',
                        h('select#subscribeSelect.form-control', {name: 'subscribe'},
                            h('option', 'Подписать меня на рассылку', {disabled: true, attrs: {selected: 'selected', value: ''}}),
                            h('option', 'О новых курсах для меня', {attrs: {value: 'courses'}}),
                            h('option', 'Об интересной статистике', {attrs: {value: 'stats'}}),
                            h('option', 'Обо всем (не чаще пары раз в месяц)', {attrs: {value: 'all'}}),
                            h('option', 'Не надо меня подписывать', {attrs: {value: ''}})
                        )
                    )
                ),
                h('div.col-auto',
                    h('button#saveResult.btn.btn-primary.mb-2', {type: 'submit'}, 'Сохранить результат')
                )
            ),
            h('div.form-row.align-items-center',
                h('div.col-auto',
                    h('p', h('a', {href: viewModel.pollUrl, target: '_blank'}, 'Помогите нам пройдя небольшой опрос (~2 мин)'))
                )
            )
        );
    },

    createSaveSuccessModal: function (viewModel) {
        return h('div#successModal.modal.fade',
            h('div.modal-dialog',
                h('div.modal-content',
                    h('div.modal-header',
                        h('h5.modal-title', 'Сохранение результатов'),
                        h('button.close', {attrs: {'data-dismiss': 'modal', 'aria-label': 'Закрыть'}},
                            h('span', {attrs: {'aria-hidden': 'true'}}, '\u00d7')
                        )
                    ),
                    h('div.modal-body',
                        h('p', 'Сделано!')
                    )
                )
            )
        );
    },

    showSuccessModal: function () {
        this.successModalInstance.show();
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
            this.createSaveSuccessModal(viewModel),
            footerView.createDOM()
        );
    },

    render: function (viewModel) {
        var moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;

        this.successModalInstance = new bsn.Modal(this.getSuccessModal());
    }
};

module.exports = function (element, stylesManager) {
    var instance = Object.create(ResultView);
    instance.init(element, stylesManager);
    return instance;
};