const BaseController = require('../base/Controller');

let ResultsController = {
    init: function (pageView, coursesListView, filterController, professionsModel, answersModel, coursesModel, xhr, tracker) {
        this.pageView = pageView;
        this.coursesListView = coursesListView;
        this.filterController = filterController;
        this.professionsModel = professionsModel;
        this.answersModel = answersModel;
        this.coursesModel = coursesModel;
        this.element = pageView.getRootElement();
        this.xhr = xhr;
        this.tracker = tracker;
        this.events = [];
    },

    initEvents: function () {
        this.events = [
            {types: ['load'], target: this.professionsModel, handler: this.renderIndexPageAfterLoad}
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

    getViewModel: function () {
        let competencyRatings = this.answersModel.getAllRatings();
        let competenciesWithRatings = [];

        Object.keys(competencyRatings).forEach(function (competencyCode) {
            let competency = this.professionsModel.getAnyProfessionCompetency(competencyCode);

            if (competency) {
                let rating = competencyRatings[competencyCode];
                let maxRating = 4;
                let ratingPercent = Math.round(rating/maxRating*100);

                competenciesWithRatings.push({
                    name: competency.name,
                    code: competency.code,
                    rating: rating,
                    ratingPercent: ratingPercent
                });
            }
        }, this);

        return {
            'pollUrl': 'https://11713.typeform.com/to/oe9WIB',
            'allCompetencies': competenciesWithRatings,
            'recommendations': this.coursesModel.getRecommendations(),
            'professions': this.professionsModel.getProfessions()
        };
    },

    renderCourses: function () {
        let viewModel = this.getViewModel();
        let coursesListDOM = this.coursesListView.createDOM(viewModel);
        this.pageView.getCoursesContainer().innerHTML = coursesListDOM.outerHTML;
    },

    renderFilter: function () {
        let professions = this.professionsModel.getProfessions().map(function (profession) {
            return {
                name: profession.name,
                code: profession.code
            }
        });

        let fieldsData = [
            {code: 'professionCode', label: 'Профессия', type: 'select', value: '', variants: professions},
            {code: 'userCompetencies', label: 'Навыки', type: 'competency', value: [], variants: [
                    {name: "Навык А", code: "skillA"},
                    {name: "Навык Б", code: "skillB"},
                    {name: "Навык В", code: "skillC"}
                ]},
            {code: 'price', label: 'Стоимость', type: 'multiCheckbox', value: '', variants: [
                    {name: "Только бесплатные", code: "free"}
                ]},
            //{code: 'dateStart', label: 'Дата начала', type: 'date', value: ''},
            {code: 'modeOfStudy', label: 'Форма обучения', type: 'multiCheckbox', value: '', variants: [
                    {name: "Очная", code: "inPerson", info: "Аудиторные занятия с преподавателями"},
                    {name: "Дистанционная", code: "longDistance", info: "Периодическое взаимодействие с преподавателями по электропочте, skype для получения образовательных материалов и задач, обсуждения их выполнения"},
                    {name: "Онлайн", code: "online", info: "Работа с образовательными материалами и преподавателями в режиме онлайн"},
                    {name: "Очная и онлайн", code: "inPersonOnline", info: "Совмещение аудиторных и онлайн занятий"},
                    {name: "Самостоятельное обучение", code: "selfStudy", info: "Самостоятнельное изучение материалов без участия преподавателя или куратора"}
                ]},
            {code: 'courseForm', label: 'Вид обучения', type: 'multiCheckbox', value: '', variants: [
                    {name: "Видеокурс", code: "video"},
                    {name: "Текстовый курс", code: "text"},
                    {name: "Интерактивный курс", code: "interactive"},
                    {name: "Интенсив", code: "crashCourse"},
                    {name: "Тренинг", code: "training"}
                ]},
            {code: 'schedule', label: 'Время проведения занятий', type: 'multiCheckbox', value: '', variants: [
                    {name: "Свободный график", code: "free"},
                    {name: "Дневные занятия", code: "day"},
                    {name: "Вечерние занятия", code: "evening"},
                    {name: "По выходным", code: "weekends"}
                ]},
            {code: 'certificate', label: 'Выдается сертификат', type: 'checkbox', value: false},
            {code: 'tasksType', label: 'Задания', type: 'multiCheckbox', value: '', variants: [
                    {name: "Без заданий", code: "noTasks"},
                    {name: "Проверка преподавателем", code: "teacherCheck"},
                    {name: "Автоматизированная проверка", code: "autoCheck"},
                    {name: "Самостоятельная проверка", code: "selfCheck"}
                ]},
            {code: 'length', label: 'Длительность', type: 'multiCheckbox', value: '', variants: [
                    {name: "Краткосрочные", code: "short", info: "Не больше одного-двух дней"},
                    {name: "Средней длительности", code: "medium", info: "Несколько месяцев"},
                    {name: "Долгосрочные", code: "long", info: "Год и больше"},
                ]},
            {code: 'platform', label: 'Платформа', type: 'multiCheckbox', value: '', variants: [
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

        let filterContainer = this.pageView.getFilterContainer();
        this.filterController.setFieldsData(fieldsData);
        this.filterController.renderFilter(filterContainer);
    },

    renderIndexPageAfterLoad: function () {
        this.pageView.render(this.getViewModel());
        this.renderFilter();
        this.initViewEvents();
        this.coursesModel.setRatings( this.answersModel.getAllRatings() );
        this.coursesModel.loadRecommendations();
    }
};

ResultsController = Object.assign(Object.create(BaseController), ResultsController);

/**
 * @param pageView
 * @param coursesListView
 * @param filterController
 * @param {ProfessionsModel} professionsModel
 * @param {AnswersModel} answersModel
 * @param {CoursesModel} coursesModel
 * @param {XMLHttpRequest} xhr
 * @param {GTagTracker} tracker
 * @returns {ResultsController}
 */
module.exports = function (pageView, coursesListView, filterController, professionsModel, answersModel, coursesModel, xhr, tracker) {
    let instance = Object.create(ResultsController);

    if (!xhr) {
        xhr = new XMLHttpRequest();
    }

    instance.init(pageView, coursesListView, filterController, professionsModel, answersModel, coursesModel, xhr, tracker);

    return instance;
};