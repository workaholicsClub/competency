const h = require('hyperscript');

let CoursesListView = {
    init: function (stylesManager) {
        this.stylesManager = stylesManager;
        this.styles = this.createStyles();
    },

    createStyles: function () {
        let styles = {
            courseCard: {
                'min-width': '250px',
                'max-width': '390px',
                '& .card-body': {
                    'border-bottom': '1px solid rgba(0,0,0,.125)'
                },
                '& .card-link': {
                    'display': 'block'
                }
            },
            accordion: {
                'border-right': '0 !important',
                '& .card': {
                    'margin': '0 !important',
                    'border-radius': '0 !important',
                    'border': '0 !important'
                },
                '& .accordion-block .collapse': {
                    'border-bottom': '1px solid rgba(0,0,0,.125)'
                },
                '& .accordion-block:last-child .card-header': {
                    'border-bottom': '0 !important'
                },
                '& .accordion-block:last-child .collapse': {
                    'border-top': '1px solid rgba(0,0,0,.125)',
                    'border-bottom': '0 !important'
                }
            },
            accordionLink: {
                'text-decoration': 'none',
                'border-bottom': '1px dashed #007bff',
                'cursor': 'pointer',
                '&:hover': {
                    'text-decoration': 'none',
                    'border-bottom': '1px dashed #0056b3',
                }
            },
            skillText: {
                'margin-right': '10px'
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
                h('small.font-weight-bold.'+this.styles.classes.skillText, name),
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
        return h('ul.list-group.list-group-flush',
            this.createParamField(viewModel.fieldNames.price, course.price > 0 ? course.price+' руб' : 'бесплатно'),
            this.createParamField(viewModel.fieldNames.modeOfStudy, viewModel.fieldVariants.modeOfStudy[course.modeOfStudy]),
            this.createParamField(viewModel.fieldNames.courseForm, viewModel.fieldVariants.courseForm[course.courseForm]),
            this.createParamField(viewModel.fieldNames.schedule, viewModel.fieldVariants.schedule[course.schedule]),
            this.createParamField(viewModel.fieldNames.certificate, course.certificate ? 'да' : 'нет'),
            this.createParamField(viewModel.fieldNames.tasksType, viewModel.fieldVariants.tasksType[course.tasksType]),
            this.createParamField(viewModel.fieldNames.length+', дни', course.lengthDays)
        );
    },

    createSkillsGroup: function (skills, viewModel) {
        let skillLevels = viewModel.levelTexts;

        return h('ul.list-group.list-group-flush',
            (skills ? skills.map(function (skill) {
                let skillLevelText = skillLevels[ skill.level ];
                return this.createSkillField(skill.text, skillLevelText);
            }, this) : [])
        );
    },

    noResults: function () {
        return h('div.list-group',
            h('span.list-group-item', 'Рекомендуемых курсов нет')
        );
    },

    createAccordionBlock: function (blockCode, blockName, parentCode, blockContent) {
        return h('div.card.accordion-block',
            h('div.card-header',
                h('a.'+this.styles.classes.accordionLink, {href: '#'+blockCode, attrs: {'data-toggle': 'collapse'}}, blockName)
            ),
            h('div#'+blockCode+'.card-body.collapse', blockContent)
        );
    },

    createAccordionListBlock: function (blockCode, blockName, parentCode, blockContent, expanded) {
        let showClass = expanded ? '.show' : '';
        return h('div.card.accordion-block',
            h('div.card-header',
                h('a.'+this.styles.classes.accordionLink, {href: '#'+blockCode, attrs: {'data-toggle': 'collapse'}}, blockName)
            ),
            h('div#'+blockCode+'.collapse'+showClass, blockContent)
        );
    },

    createDOM: function (viewModel) {
        if (viewModel.courses === undefined || viewModel.courses.length === 0) {
            return this.noResults();
        }

        return h('div#coursesList.card-deck',
            viewModel.courses.map(function (course, index) {
                let accordionId = 'accordion'+index;

                return h('div.card.mb-4.'+this.styles.classes.courseCard,
                    h('div.card-header',
                        h('a.card-link', {href: course.url, target:'_blank'}, course.name),
                        h('small', course.eduProvider.name)
                    ),
                    h('div#'+accordionId+'.'+this.styles.classes.accordion,
                        this.createAccordionListBlock('skills'+index, 'Содержание курса', accordionId, this.createSkillsGroup(course.skills, viewModel), true),
                        this.createAccordionListBlock('requirements'+index, 'Требования', accordionId, this.createSkillsGroup(course.requirements, viewModel)),
                        this.createAccordionBlock('description'+index, 'Текстовое описание', accordionId, course.description),
                        this.createAccordionListBlock('params'+index, 'Основные параметры', accordionId, this.createBaseParams(course, viewModel)),
                    ),
                );
            }, this)
        );
    },

    getCollapseLinks: function (rootElement) {
        return rootElement.querySelectorAll('[data-toggle="collapse"]');
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