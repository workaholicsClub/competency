const h = require('hyperscript');

let CoursesListView = {
    init: function (stylesManager) {
        this.stylesManager = stylesManager;
        this.styles = this.createStyles();
    },

    createStyles: function () {
        let styles = {
            courseCard: {
                'min-width': '250px'
            }
        };

        return this.stylesManager.createStyleSheet(styles).attach();
    },

    createCompetenciesList: function (competencies, totalIncrement) {
        return h('ul.list-group.list-group-flush',
            h('li.list-group-item.list-group-item-success.d-flex.justify-content-between.align-items-center.list-group-item-action', "Общая полезность",
                h('span.badge.badge-primary.badge-pill', '+' + totalIncrement+'%')
            ),
            (competencies ? competencies.map(function (competency) {
                return h('li.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', competency.name,
                    h('span.badge.badge-primary.badge-pill', '+' + competency.realIncrementPercent+'%')
                );
            }) : [])
        );
    },

    createParamField: function (name, value) {
        return h('li.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action',
            h('div.d-flex.w-100.justify-content-between',
                h('small.font-weight-bold', name),
                h('small.text-right', value)
            )
        );
    },

    createSkillField: function (name, value) {
        return this.createParamField(name, value);
    },

    createBadgeSkillField: function (name, value) {
        return h('li.list-group-item.d-flex.justify-content-between.align-items-center.list-group-item-action', name,
            h('span.badge.badge-primary.badge-pill', value)
        );
    },

    createBaseParams: function (course, viewModel) {
        return [
            h('div.card-header', 'Основные параметры'),
            h('ul.list-group.list-group-flush',
                this.createParamField(viewModel.fieldNames.price, course.price > 0 ? course.price+' руб' : 'бесплатно'),
                this.createParamField(viewModel.fieldNames.modeOfStudy, viewModel.fieldVariants.modeOfStudy[course.modeOfStudy]),
                this.createParamField(viewModel.fieldNames.courseForm, viewModel.fieldVariants.courseForm[course.courseForm]),
                this.createParamField(viewModel.fieldNames.schedule, viewModel.fieldVariants.schedule[course.schedule]),
                this.createParamField(viewModel.fieldNames.certificate, course.certificate ? 'да' : 'нет'),
                this.createParamField(viewModel.fieldNames.tasksType, viewModel.fieldVariants.tasksType[course.tasksType]),
                this.createParamField(viewModel.fieldNames.length+', дни', course.lengthDays)
            )
        ];
    },

    createCompetenciesGroup: function (title, competencies) {
        return [
            h('div.card-header', title),
            h('ul.list-group.list-group-flush',
                (competencies ? competencies.map(function (competency) {
                    return this.createSkillField(competency.name, competency.ratingPercent+'%');
                }, this) : [])
            )
        ];
    },

    noResults: function () {
        return h('div.list-group',
            h('span.list-group-item', 'Рекомендуемых курсов нет')
        );
    },

    createDOM: function (viewModel) {
        if (viewModel.courses === undefined || viewModel.courses.length === 0) {
            return this.noResults();
        }

        return h('div#coursesList.card-deck',
            viewModel.courses.map(function (course) {
                return h('div.card.mb-4.'+this.styles.classes.courseCard,
                    h('div.card-body',
                        h('h5.card-title',
                            h('a', {href: course.url, target:'_blank'}, course.name)
                        ),
                        h('p.card-text', course.description)
                    ),
                    this.createBaseParams(course, viewModel),
                    this.createCompetenciesGroup('Требования', course.requirementCompetencies),
                    this.createCompetenciesGroup('Навыки', course.skillCompetencies)
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
    let instance = Object.create(CoursesListView);
    instance.init(stylesManager);

    return instance;
};