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
        {code: 'homework', title: 'Домашка'},
        {code: 'internship', title: 'Стажировка'},
        {code: 'app', title: 'Приложение'},
        {code: 'game', title: 'Игра'},
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
    homework: {
        defaultLang: 'python',
        lang: [
            {code: 'python', title: 'Python', repl: '@AlieksandrPavlo/PythonTemplate'},
            {code: 'javascript', title: 'JavaScript', repl: '@AlieksandrPavlo/JavaScriptTemplate'},
            {code: 'java', title: 'Java', repl: '@AlieksandrPavlo/JavaTemplate'},
            {code: 'php', title: 'PHP', repl: '@AlieksandrPavlo/PhpTemplate'},
            {code: 'golang', title: 'Go', repl: '@AlieksandrPavlo/GoTemplate'},
            {code: 'swift', title: 'Swift', repl: '@AlieksandrPavlo/SwiftTemplate'},
            {code: 'kotlin', title: 'Kotlin', repl: '@AlieksandrPavlo/KotlinTemplate'},
            {code: 'cpp', title: 'C++', repl: '@AlieksandrPavlo/CppTemplate'},
            {code: 'html', title: 'HTML/CSS', repl: '@AlieksandrPavlo/HtmlCssTemplate'},
        ]
    },
    app: {},
    game: {
        platform: [
            {code: 'web', title: 'Веб'},
            {code: 'android', title: 'Android'},
            {code: 'ios', title: 'iOS'},
            {code: 'windows', title: 'Windows'},
            {code: 'linux', title: 'Linux'},
            {code: 'macos', title: 'MacOS'},
        ],
        audience: audience
    },
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
    requestValues: {
        who: {
            'qa-tester': 'тестировщик',
            'javascript-developer': 'разработчик JavaScript',
            'php-developer': 'разработчик PHP',
            'python-developer': 'разработчик Python',
            'data-scientist': 'Data Scientist',
            'internet-marketologist': 'интернет-маркетолог',
            'golang-developer': 'разработчик Golang',
            'ios-developer': 'разработчик iOS',
            'android-developer': 'разработчик Android',
            'ui-ux-designer': 'UI/UX дизайнер',
            'game-designer': 'гейм-дизайнер',
            'game-artist-2d': 'игровой художник 2D',
            'game-artist-3d': 'игровой художник 3D',
            'pr-specialist': 'PR специалист',
            'hr-manager': 'HR менеджер',
            'project-manager': 'менеджер интернет-проектов',
            'devops': 'DevOps специалист',
            'non-prof': ['новичок', 'специалист из другой области'],
        },
        exp: [
            'без опыта работы',
            'с опытом работы до 3 лет',
            'с опытом работы 3 или более года'
        ],
        want: {
            'php-developer': 'разработчиком PHP',
            'hr-manager': 'стать HR менеджером',
            'pr-specialist': 'стать PR специалистом',
            'python-developer': 'стать разработчиком Python',
            'golang-developer': 'стать разработчиком Golang',
            'javascript-developer': 'стать разработчиком JavaScript',
            'ui-ux-designer': 'стать UI/UX дизайнером',
            'ios-developer': 'стать разработчиком iOS',
            'android-developer': 'стать разработчиком Android',
            'internet-marketologist': 'стать интернет-маркетологом',
            'qa-tester': 'стать тестировщиком',
            'devops': 'стать DevOps специалистом',
            'data-scientist': 'стать Data Scientist`ом',
            'game-designer': 'стать гейм-дизайнером',
            'project-manager': 'стать менеджером интернет-проектов',
            'game-artist-2d': 'стать игровым художником 2D',
            'game-artist-3d': 'стать игровым художником 3D',
            'universal': ['начать с нуля', 'продолжить обучение', 'повысить квалификацию', 'прокачать навык']
        }
    }
}