const h = require('hyperscript');

var CoursesListView = {
    init: function (stylesManager) {
        this.stylesManager = stylesManager;
    },

    createCompetenciesList: function (competencies, totalIncrement) {
        return h('ul.list-group.list-group-flush',
            h('li.list-group-item.list-group-item-success.d-flex.justify-content-between.align-items-center.list-group-item-action', "Общая полезность",
                h('span.badge.badge-primary.badge-pill', '+' + totalIncrement+'%')
            ),
            competencies.map(function (competency) {
                return h('li.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', competency.name,
                    h('span.badge.badge-primary.badge-pill', '+' + competency.realIncrementPercent+'%')
                );
            })
        );
    },

    noResults: function () {
        return h('div.list-group',
            h('span.list-group-item', 'Рекомендуемых курсов нет')
        );
    },

    createDOM: function (viewModel) {
        if (viewModel.recommendations === undefined || viewModel.recommendations.length === 0) {
            return this.noResults();
        }

        return h('div#recommendationsList.card-deck',
            viewModel.recommendations.map(function (recommendation) {
                var courseParams = 'Стоимость: '+ recommendation.price + ' руб ' +
                                '(недель: ' + recommendation.weeks + ', ' +
                                'занятий: ' + recommendation.lessons + ')';

                return h('div.card',
                    h('div.card-body',
                        h('h5.card-title',
                            h('a', {href: recommendation.url, target:'_blank'}, recommendation.name)
                        )
                    ),
                    this.createCompetenciesList(recommendation.competencies, recommendation.totalIncrementPercent),
                    h('div.card-footer', courseParams)
                )
            }, this)
        );
    }
};

/**
 * @param stylesManager
 * @returns {CoursesListView}
 */
module.exports = function (stylesManager) {
    var instance = Object.create(CoursesListView);
    instance.init(stylesManager);

    return instance;
};