let audience = [
    {code: 'junior', title: 'Для начинающих'},
    {code: 'middle', title: 'Средний уровень'},
    {code: 'senior', title: 'Для профессионалов'},
];

export default {
    types: [
        {code: 'course', title: 'Курс'},
        {code: 'book', title: 'Книга'},
        {code: 'project', title: 'Идея проекта'},
        {code: 'explain', title: 'Объяснение'},
        {code: 'motivation', title: 'Мотивация'},
        {code: 'internship', title: 'Стажировка'},
    ],
    audience: audience,
    templates: {
        'novice': {
            skillRateFilter: {
                existing: false,
                needed: [35, 100]
            }
        },
        'novice-continue': {
            skillRateFilter: {
                existing: [80, 100],
                needed: [35, 80]
            }
        },
        'other-novice': {

        },
        'other-novice-continue': {
            skillRateFilter: {
                existing: [80, 100],
                needed: [35, 80]
            }
        },
        'skill': {
            skillRateFilter: {
                existing: false,
                needed: false
            }
        },
        'middle-continue': {
            skillRateFilter: {
                existing: [70, 100],
                needed: [15, 70]
            }
        },
        'senior-continue': {
            skillRateFilter: {
                existing: [70, 100],
                needed: [0, 70]
            }
        }
    },
    course: {
        forms: [
            {code: 'online', title: 'Онлайн'},
            {code: 'offline', title: 'Очный'},
        ],
        formats: [
            {code: 'video', title: 'Видео'},
            {code: 'webinar', title: 'Вебинар'},
            {code: 'chat', title: 'Чат'},
            {code: 'intensive', title: 'Интенсив'},
            {code: 'interactive', title: 'Интерактивный'},
            {code: 'textbook', title: 'Электронный учебник'},
        ],
        times: [
            {code: 'day', title: 'Днем'},
            {code: 'evening', title: 'Вечером'},
            {code: 'dayoffs', title: 'По выходным'},
        ],
        certificates: [
            {code: 'self', title: 'Собственный'},
            {code: 'state', title: 'Гос. образца'},
            {code: 'international', title: 'Международный'},
        ],
        priceTypes: [
            {code: 'total', title: 'За весь курс'},
            {code: 'lesson', title: 'За занятие'},
            {code: 'module', title: 'За модуль'},
            {code: 'month', title: 'В месяц'},
        ],
        durationUnits: [
            {code: 'minute', title: 'минута'},
            {code: 'hour', title: 'час'},
            {code: 'academic-hour', title: 'ак. час'},
            {code: 'day', title: 'день'},
            {code: 'week', title: 'неделя'},
            {code: 'month', title: 'месяц'},
            {code: 'lesson', title: 'урок'},
            {code: 'module', title: 'модуль'}
        ],
        loadUnits: [
            {code: 'hour-per-day', title: 'час в день'},
            {code: 'hour-per-week', title: 'час в неделю'},
            {code: 'day-per-week', title: 'день в неделю'},
            {code: 'self', title: 'самостоятельно'},
        ],
        audience: audience
    },
    book: {
        formats: [
            {'code': 'digital', 'title': 'Электронная'},
            {'code': 'print', 'title': 'Печатная'},
        ],
        audience: audience
    },
    project: {},
    explain: {},
    motivation: {},
    internship: {
        salaryTypes: [
            {code: 'month', title: 'В месяц'},
            {code: 'hour', title: 'В час'},
        ],
        durationUnits: [
            {code: 'week', title: 'неделя'},
            {code: 'month', title: 'месяц'},
            {code: 'year', title: 'год'},
        ],
        loadUnits: [
            {code: 'hour-per-day', title: 'час в день'},
            {code: 'hour-per-week', title: 'час в неделю'},
            {code: 'day-per-week', title: 'день в неделю'},
            {code: 'self', title: 'самостоятельно'},
        ],

    },
    professionNames: {
        'php-developer': 'разработчик PHP',
        'hr-manager': 'HR менеджер',
        'pr-specialist': 'PR специалист',
        'python-developer': 'разработчик Python',
        'golang-developer': 'разработчик Golang',
        'javascript-developer': 'разработчик JavaScript',
        'ui-ux-designer': 'UI/UX дизайнер',
        'ios-developer': 'разработчик iOS',
        'android-developer': 'разработчик Android',
        'internet-marketologist': 'интернет-маркетолог',
        'qa-tester': 'тестировщик',
        'devops': 'DevOps специалист',
        'data-scientist': 'Data Scientist',
        'game-designer': 'гейм-дизайнер',
        'project-manager': 'менеджер интернет-проектов',
        'game-artist-2d': 'игровой художник 2D',
        'game-artist-3d': 'игровой художник 3D'
    },
    professionNamesTP: {
        'php-developer': 'разработчиком PHP',
        'hr-manager': 'HR менеджером',
        'pr-specialist': 'PR специалистом',
        'python-developer': 'разработчиком Python',
        'golang-developer': 'разработчиком Golang',
        'javascript-developer': 'разработчиком JavaScript',
        'ui-ux-designer': 'UI/UX дизайнером',
        'ios-developer': 'разработчиком iOS',
        'android-developer': 'разработчиком Android',
        'internet-marketologist': 'интернет-маркетологом',
        'qa-tester': 'тестировщиком',
        'devops': 'DevOps специалистом',
        'data-scientist': 'Data Scientist`ом',
        'game-designer': 'гейм-дизайнером',
        'project-manager': 'менеджером интернет-проектов',
        'game-artist-2d': 'игровым художником 2D',
        'game-artist-3d': 'игровым художником 3D'
    },
}