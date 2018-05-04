const BaseController = require('../base/Controller');

let CoursesController = {
    init: function (pageView, coursesListView, filterController, filterModel, professionsModel, answersModel, coursesModel, xhr, tracker, user) {
        this.pageView = pageView;
        this.coursesListView = coursesListView;
        this.filterController = filterController;
        this.filterModel = filterModel;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.coursesModel = coursesModel;
        this.element = pageView.getRootElement();
        this.xhr = xhr;
        this.tracker = tracker;
        this.events = [];
        this.user = user;
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad},
            {types: ['change'], target: this.answersModel, handler: this.updateCourses},
            {types: ['change'], target: this.filterModel, handler: this.updateCourses}
        ];

        if (this.xhr) {
            this.events.push({types: ['load'], target: this.xhr, handler: this.saveSuccess});
        }

        this.bindEvents();
    },

    initViewEvents: function () {
        let additionalEvents = [
            {types: ['load'], target: this.coursesModel, handler: this.renderCourses}
        ];

        this.events = this.events.concat(additionalEvents);

        this.bindEvents(additionalEvents);
    },

    loadDataAndRenderIndexPage: function () {
        this.initEvents();

        if (this.professionsModel.isLoaded()) {
            this.renderIndexPageAfterLoad();
        }
        else {
            this.professionsModel.load();
        }
    },

    getFilterValue: function (code) {
        return this.filterController.getFieldValue(code);
    },

    getCompetenciesWithRatings: function (competencyRatings) {
        let competenciesWithRatings = [];
        Object.keys(competencyRatings).forEach(function (competencyCode) {
            let competency = this.professionsModel.getAnyProfessionCompetency(competencyCode);

            if (competency) {
                let rating = competencyRatings[competencyCode];
                let ratingPercent = this.answersModel.getRatingPercent(rating);

                competenciesWithRatings.push({
                    name: competency.name,
                    code: competency.code,
                    rating: rating,
                    ratingPercent: ratingPercent
                });
            }
        }, this);

        return competenciesWithRatings;
    },

    getViewModel: function () {
        let competencyRatings = this.answersModel.getAllRatings();
        let competenciesWithRatings = this.getCompetenciesWithRatings(competencyRatings);
        let userId = this.user ? this.user.getId() : '';
        let sessionId = this.user ? this.user.getSessionId() : '';

        let courses = [];
        this.coursesModel.getLoadedCourses().forEach(function (courseModel) {
            let courseData = courseModel.getProps();
            let competencies = this.professionsModel.getCompetencies();

            let skillCompetenciesRatings = courseModel.getSkillsAsCompetencies(competencies);
            let requirementCompetenciesRatings = courseModel.getRequirementsAsCompetencies(competencies);

            courseData.url = courseModel.getFullUrl(userId, sessionId);
            courseData.skillCompetencies = this.getCompetenciesWithRatings(skillCompetenciesRatings);
            courseData.requirementCompetencies = this.getCompetenciesWithRatings(requirementCompetenciesRatings);

            courses.push(courseData);
        }, this);

        let fieldNames = this.getFilterFields().reduce(function (accumulator, filterField) {
            accumulator[filterField.code] = filterField.label;
            return accumulator;
        }, {});

        let fieldVariants = this.getFilterFields().reduce(function (accumulator, filterField) {
            if (filterField.variants) {
                accumulator[filterField.code] = filterField.variants.reduce(function (variantAccumulator, variant) {
                    variantAccumulator[variant.code] = variant.name;
                    return variantAccumulator;
                }, {});
            }

            return accumulator;
        }, {});

        return {
            'allCompetencies': competenciesWithRatings,
            'courses': courses,
            'professions': this.professionsModel.getProfessions(),
            'fieldNames': fieldNames,
            'fieldVariants': fieldVariants
        };
    },

    renderCourses: function () {
        let viewModel = this.getViewModel();
        let coursesListDOM = this.coursesListView.createDOM(viewModel);
        this.pageView.getCoursesContainer().innerHTML = coursesListDOM.outerHTML;
    },

    getFilterFields: function () {
        let professions = this.professionsModel.getProfessions().map(function (profession) {
            return {
                name: profession.name,
                code: profession.code
            }
        });

        let professionCompetencies = this.professionsModel.getCompetencies();

        return [
            //{code: 'professionCode', label: 'Профессия', type: 'select', value: this.getFilterValue('professionCode'), variants: professions},
            {code: 'userSkills', label: 'Навыки', type: 'competency', value: this.getFilterValue('userCompetencies'), variants: professionCompetencies},
            {code: 'price', label: 'Стоимость', type: 'multiCheckbox', value: this.getFilterValue('price'), variants: [
                    {name: "Только бесплатные", code: "free"}
                ]},
            //{code: 'dateStart', label: 'Дата начала', type: 'date', value: ''},
            {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: this.getFilterValue('modeOfStudy'), variants: [
                    {name: "Очная", code: "inPerson", info: "Аудиторные занятия с преподавателями"},
                    {name: "Дистанционная", code: "longDistance", info: "Периодическое взаимодействие с преподавателями по электропочте, skype для получения образовательных материалов и задач, обсуждения их выполнения"},
                    {name: "Онлайн", code: "online", info: "Работа с образовательными материалами и преподавателями в режиме онлайн"},
                    {name: "Очная и онлайн", code: "inPersonOnline", info: "Совмещение аудиторных и онлайн занятий"},
                    {name: "Самостоятельное обучение", code: "selfStudy", info: "Самостоятельное изучение материалов без участия преподавателя или куратора"}
                ]},
            {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: this.getFilterValue('courseForm'), variants: [
                    {name: "Видеокурс", code: "video"},
                    {name: "Текстовый курс", code: "text"},
                    {name: "Интерактивный курс", code: "interactive"},
                    {name: "Интенсив", code: "crashCourse"},
                    {name: "Тренинг", code: "training"}
                ]},
            {code: 'schedule', label: 'Время проведения занятий', type: 'multiCheckbox', value: this.getFilterValue('schedule'), variants: [
                    {name: "Свободный график", code: "free"},
                    {name: "Дневные занятия", code: "day"},
                    {name: "Вечерние занятия", code: "evening"},
                    {name: "По выходным", code: "weekends"}
                ]},
            {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: this.getFilterValue('certificate')},
            {code: 'tasksType', label: 'Задания', type: 'multiCheckbox', value: this.getFilterValue('tasksType'), variants: [
                    {name: "Без заданий", code: "noTasks"},
                    {name: "Проверка преподавателем", code: "teacherCheck"},
                    {name: "Автоматизированная проверка", code: "autoCheck"},
                    {name: "Самостоятельная проверка", code: "selfCheck"}
                ]},
            {code: 'length', label: 'Длительность', type: 'multiCheckbox', value: this.getFilterValue('length'), variants: [
                    {name: "Краткосрочные", code: "short", info: "Не больше одного-двух дней"},
                    {name: "Средней длительности", code: "medium", info: "Несколько месяцев"},
                    {name: "Долгосрочные", code: "long", info: "Год и больше"},
                ]},
            {code: 'eduProvider', label: 'Платформа', type: 'multiCheckbox', value: this.getFilterValue('platform'), variants: [
                    {name: "Stepik", code: "stepik"},
                    {name: "Нетология", code: "netology"},
                    {name: "Otus", code: "otus"},
                    {name: "Hexlet", code: "hexlet"},
                    {name: "Coursera", code: "coursera"},
                    {name: "Udemy", code: "udemy"},
                    {name: "GeekBrains", code: "geekbrains"},
                    {name: "Moscow Coding School", code: "moscoding"},
                    {name: "Intuit", code: "intuit"},
                    {name: "HtmlAcademy", code: "htmlacademy"}
                ]},
            //{code: '', label: '', type: '', value: '', variants: []},
        ];
    },

    renderFilter: function () {
        let fieldsData = this.getFilterFields();
        let filterContainer = this.pageView.getFilterContainer();

        this.filterController.setFieldsData(fieldsData);
        this.filterController.renderFilter(filterContainer);
    },

    updateCourses: function() {
        let ratings = this.answersModel.getAllRatings();
        let fieldsData = this.getFilterFields();

        this.coursesModel.setRatings( ratings );
        this.coursesModel.loadFilteredCourses(this.filterModel, this.answersModel, fieldsData);
    },

    renderIndexPageAfterLoad: function () {
        this.pageView.render(this.getViewModel());
        this.renderFilter();
        this.initViewEvents();
        this.updateCourses();
    }
};

CoursesController = Object.assign(Object.create(BaseController), CoursesController);

/**
 * @param pageView
 * @param coursesListView
 * @param filterController
 * @param {FilterModel} filterModel
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @param {CourseCollection} coursesModel
 * @param {XMLHttpRequest} xhr
 * @param {GTagTracker} tracker
 * @param {UserModel} user
 * @returns {CoursesController}
 */
module.exports = function (pageView, coursesListView, filterController, filterModel, professionsModel, answersModel, coursesModel, xhr, tracker, user) {
    let instance = Object.create(CoursesController);

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    instance.init(pageView, coursesListView, filterController, filterModel, professionsModel, answersModel, coursesModel, xhr, tracker, user);

    return instance;
};