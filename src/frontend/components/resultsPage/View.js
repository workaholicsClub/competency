const h = require('hyperscript');
const footerViewFactory = require('../footer/View');
const bsn = require('bootstrap.native/dist/bootstrap-native-v4');

let ResultView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
        this.successModalInstance = false;
    },

    createStyles: function () {
        let styles = {
            evaluateLink: {
                'text-decoration': 'none',
                'border-bottom': '1px dashed #007bff',
                'cursor': 'pointer',
                '&:hover': {
                    'text-decoration': 'none',
                    'border-bottom': '1px dashed #0056b3',
                }
            }
        };

        return this.stylesManager.createStyleSheet(styles).attach();
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

    createResults: function (viewModel, styles) {
        if (viewModel.allCompetencies.length === 0) {
            return this.noResults();
        }

        return h('div.list-group',
            viewModel.allCompetencies.map(function (competency) {
                return h('a.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', competency.name,
                    h('span.badge.badge-primary.badge-pill', competency.ratingPercent+'%')
                )
            })
        );
    },

    createCompetenciesTable: function (viewModel, styles) {
        return h('table.table.table-striped.table-bordered',
            h('thead',
                h('tr',
                    h('th', 'Компетенции', {attrs: {scope: "col"}}),
                    h('th', 'Средние значения', {attrs: {scope: "col"}}),
                    h('th', 'Результат самооценки', {attrs: {scope: "col"}}),
                    h('th', 'Отклонение', {attrs: {scope: "col"}}),
                ),
            ),
            h('tbody',
                viewModel.professionCompetencies.map(function (competency) {
                    let averageData = competency.average;
                    let averageText = averageData.average + ' (' + averageData.lower + '-' + averageData.upper + ')';

                    let ratingText = competency.ratingPercent !== false
                        ? competency.ratingPercent+'%'
                        : 'оценить';

                    let sign = averageData.diff > 0 ? '+' : '';
                    let diffText = (averageData.diff > 0 || averageData.diff < 0)
                        ? sign+averageData.diff+'%'
                        : 'нет';

                    let badgeClass = averageData.diff > 0
                        ? '.badge.badge-pill.badge-success'
                        : (averageData.diff < 0
                            ? '.badge.badge-pill.badge-danger'
                            : ''
                        );

                    let diffPill = h('span'+badgeClass, diffText);

                    return h('tr',
                        h('td', h('a.'+styles.classes.evaluateLink, competency.name, {href: competency.link}), {attrs: {scope: "row"}}),
                        h('td', averageText),
                        h('td', h('a.'+styles.classes.evaluateLink, ratingText, {href: competency.link})),
                        h('td', diffPill)
                    );
                })
            )
        );
    },

    createHiddenInputs: function (viewModel, styles) {
        return viewModel.allCompetencies.map(function (competency) {
            return h('input', {name: 'competency[' + competency.code + ']', type: 'hidden', attrs: {value: competency.rating}})
        });
    },

    createSubscribeForm: function (viewModel, styles) {
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
            )
        );
    },

    createSaveSuccessModal: function (viewModel, styles) {
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
        let styles = this.createStyles();
        let footerView = footerViewFactory(this.stylesManager);
        let pageTitle = viewModel.professionName + ': компетенции';

        return h('div#page.container-fluid.mt-3',
            h('div#head.row',
                h('div.col-md-12',
                    h('div.page-header',
                        h('h1.display-4', pageTitle)
                    )
                )
            ),
            h('div#content.row.mt-5',
                h('div.col-md-12',
                    this.createCompetenciesTable(viewModel, styles)
                )
            ),
            h('div#buttons.row.mt-3',
                h('div.col-md-12.text-right', h('a#courses.btn.btn-primary.mb-2', {href: viewModel.coursesLink}, 'Подобрать курсы'))
            ),
            h('div#save.row.mt-3',
                h('div.col-md-12.text-centered', this.createSubscribeForm(viewModel, styles))
            ),
            this.createSaveSuccessModal(viewModel, styles),
            footerView.createDOM()
        );
    },

    render: function (viewModel) {
        let moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;

        this.successModalInstance = new bsn.Modal(this.getSuccessModal());
    }
};

module.exports = function (element, stylesManager) {
    let instance = Object.create(ResultView);
    instance.init(element, stylesManager);
    return instance;
};