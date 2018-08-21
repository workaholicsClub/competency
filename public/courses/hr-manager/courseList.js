function getCoursesList() {
    return [
        {
            id: 1,
            platform: 'ТехноПрогресс',
            title: 'Альтернативы в подборе персонала: соцсети, крауд-сорсинговые платформы, современные подходы',
            url: 'http://www.cpobr.ru/alternativy_v_podbore_personala_socseti_kraud_sorsingovye_platformy_sovremennye_praktiki/',
            format: 'Вебинар',
            hasTeacher: true,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 2,
            durationUnits: 'ак. час',
            price: 0,
            skills: {
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 2,
            platform: 'ТехноПрогресс',
            title: 'Изменения в трудовом законодательстве 2018',
            url: 'http://www.cpobr.ru/izmeneniya_v_trudovom_zakonodatelstve_2018/',
            format: ['Вебинар', 'Очная'],
            hasTeacher: true,
            hasPractice: false,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 8,
            durationUnits: 'ак. час',
            price: 7470,
            skills: {
                'Трудовой кодекс РФ': 3,
                'Кадровый учет': 3,
                'Составление трудовых договоров': 3
            },
            requirements: {
                'Трудовой кодекс РФ': 3,
                'Кадровый учет': 3,
                'Составление трудовых договоров': 3
            }
        },
        {
            id: 3,
            platform: 'ТехноПрогресс',
            title: 'Программа профессиональной переподготовки «Управление персоналом»',
            url: 'http://www.cpobr.ru/programma_professionalnoy_perepodgotovki_upravlenie_personalom/',
            format: ['Вебинар', 'Очная'],
            hasTeacher: true,
            hasPractice: false,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 256,
            durationUnits: 'ак. час',
            price: 30000,
            skills: {
                'Кадровый учет': 1,
                'Составление трудовых договоров': 1,
                'Кадровое делопроизводство': 1,
                'Мотивация сотрудников': 1,
                'Оценка сотрудников': 1,
                'Выстраивание внутренних коммуникаций': 1,
                'Управление корпоративной культурой': 1,
                'Развитие сотрудников': 1,
                'Адаптация сотрудников': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Увольнение сотрудников': 1,
                'Аттестация персонала': 1
            },
            requirements: {}
        },
        {
            id: 4,
            platform: 'ТехноПрогресс',
            title: 'HR-менеджер. Подбор и управление персоналом',
            url: 'http://www.cpobr.ru/hr_menedzher_podbor_i_upravlenie_personalom/',
            format: ['Вебинар', 'Очная'],
            hasTeacher: true,
            hasPractice: false,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 48,
            durationUnits: 'ак. час',
            price: 17470,
            skills: {
                'Выстраивание HR-процессов': 1,
                'Составление должностных инструкций': 1,
                'Оценка сотрудников': 1,
                'Мотивация сотрудников': 1,
                'Системы KPI': 1,
                'Программы стимулирования персонала': 1,
                'Управление корпоративной культурой': 1,
                'Кадровое планирование': 1,
                'Адаптация сотрудников': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Развитие сотрудников': 1,
                'Системы KPI': 1,
                'Кадровое планирование': 1
            },
            requirements: {}
        },
        {
            id: 5,
            platform: 'Русская Школа Управления',
            title: 'Кадровое планирование и бюджетирование',
            url: 'https://uprav.ru/kursy-upravleniya-personalom/kadrovoe-planirovanie-i-byudzhetirovanie/',
            format: 'Очная',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 16,
            durationUnits: 'ак. час',
            price: 26500,
            skills: {
                'Кадровая аналитика и статистика': 2,
                'Бюджетирование': 2,
                'Выстраивание HR-процессов': 2,
                'Кадровое планирование': 2
            },
            requirements: {
                'Кадровая аналитика и статистика': 1,
                'Бюджетирование': 1,
                'Выстраивание HR-процессов': 1,
                'Кадровое планирование': 1
            }
        },
        {
            id: 6,
            platform: 'Русская Школа Управления',
            title: 'Курс повышения квалификации директора по персоналу',
            url: 'https://uprav.ru/kursy-upravleniya-personalom/direktor-po-personalu/',
            format: 'Очная',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 5,
            durationUnits: 'день',
            price: 55500,
            skills: {
                'Кадровая аналитика и статистика': 2,
                'Бюджетирование': 2,
                'Выстраивание HR-процессов': 2,
                'Кадровое планирование': 2,
                'Кадровое делопроизводство': 1,
                'Оценка сотрудников': 1,
                'Программы адаптации персонала': 1,
                'Аттестация персонала': 1,
                'Программы отбора персонала': 1,
                'Программы привлечения персонала': 1,
                'Программы развития персонала': 1,
                'Система грейдов': 2,
                'Мотивация сотрудников': 1,
                'Системы KPI': 2,
                'Выстраивание внутренних коммуникаций': 1,
                'Управление изменениями': 2,
                'Формирование HR-бренда': 1
            },
            requirements: {
                'Кадровая аналитика и статистика': 1,
                'Бюджетирование': 1,
                'Выстраивание HR-процессов': 1,
                'Кадровое планирование': 1
            }
        },
        {
            id: 6.5,
            platform: 'Русская Школа Управления',
            title: 'Курс повышения квалификации директора по персоналу',
            url: 'https://uprav.ru/kursy-upravleniya-personalom/1350777622/',
            format: 'Онлайн',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 5,
            durationUnits: 'день',
            price: 55500,
            skills: {
                'Кадровая аналитика и статистика': 2,
                'Бюджетирование': 2,
                'Выстраивание HR-процессов': 2,
                'Кадровое планирование': 2,
                'Кадровое делопроизводство': 1,
                'Оценка сотрудников': 1,
                'Программы адаптации персонала': 1,
                'Аттестация персонала': 1,
                'Программы отбора персонала': 1,
                'Программы привлечения персонала': 1,
                'Программы развития персонала': 1,
                'Система грейдов': 2,
                'Мотивация сотрудников': 1,
                'Системы KPI': 2,
                'Выстраивание внутренних коммуникаций': 1,
                'Управление изменениями': 2,
                'Формирование HR-бренда': 1
            },
            requirements: {
                'Кадровая аналитика и статистика': 1,
                'Бюджетирование': 1,
                'Выстраивание HR-процессов': 1,
                'Кадровое планирование': 1
            }
        },
        {
            id: 7,
            platform: 'Русская Школа Управления',
            title: 'Специалист отдела кадров. Практический курс',
            url: 'https://uprav.ru/kursy-upravleniya-personalom/spetsialist-otdela-kadrov-prakticheskiy-kurs/',
            format: 'Очная',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 4,
            durationUnits: 'день',
            price: 47900,
            skills: {
                'Кадровое делопроизводство': 2,
                'Кадровый учет': 2,
                'Поиск сотрудников на массовые должности': 2,
                'Увольнение сотрудников': 2,
                'Составление должностных инструкций': 2,
                'Управление изменениями': 2
            },
            requirements: {
                'Кадровое делопроизводство': 1,
                'Кадровый учет': 1,
                'Поиск сотрудников на массовые должности': 1,
                'Увольнение сотрудников': 1,
                'Составление должностных инструкций': 1,
                'Управление изменениями': 1
            }
        },
        {
            id: 8,
            platform: 'Русская Школа Управления',
            title: 'Технологии массового рекрутмента',
            url: 'https://uprav.ru/kursy-upravleniya-personalom/1350768418/',
            format: 'Вечерняя',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 3,
            durationUnits: 'час',
            price: 9900,
            skills: {
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Поиск сотрудников на массовые должности': 1
            },
            requirements: {}
        },
        {
            id: 9,
            platform: 'Специалист',
            title: 'Специалист по зарплате и управлению персоналом в 1С: Предприятие 8',
            url: 'https://www.specialist.ru/track/t-1czuotch',
            format: ['Очная', 'Вечерняя', 'Выходные', 'Онлайн'],
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 68,
            durationUnits: 'ак. час',
            price: 24690,
            skills: {
                'Владение 1С ЗУП': 2
            },
            requirements: {
                'Кадровый учет': 1,
                'Трудовой кодекс РФ': 1
            }
        },
        {
            id: 10,
            platform: 'Специалист',
            title: 'Менеджер по персоналу со знанием кадрового дела и 1С (HR - generalist)',
            url: 'https://www.specialist.ru/track/t-mper1c',
            format: ['Очная', 'Вечерняя', 'Выходные', 'Онлайн'],
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 96,
            durationUnits: 'ак. час',
            price: 31690,
            skills: {
                'Кадровое делопроизводство': 1,
                'Кадровый учет': 1,
                'Увольнение сотрудников': 1,
                'Аттестация персонала': 1,
                'Трудовой кодекс РФ': 1,
                'Адаптация сотрудников': 1,
                'Оценка сотрудников': 1,
                'Развитие сотрудников': 1,
                'Программы стимулирования персонала': 1,
                'Программы развития персонала': 1,
                'Владение 1С ЗУП': 1
            },
            requirements: {}
        },
        {
            id: 11,
            platform: 'HR-Академия',
            title: 'Менеджер по подбору и адаптации персонала (рекрутер)',
            url: 'https://hr-academy.ru/podbor-adaptatsiya-personala',
            format: 'Онлайн',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Собственный',
            city: 'Москва',
            duration: 18,
            durationUnits: 'урок',
            price: 16600,
            skills: {
                'Адаптация сотрудников': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1,
                'Проведение телефонных интервью': 1,
                'Программы адаптации персонала': 1
            },
            requirements: {}
        },
        {
            id: 12,
            platform: 'HR-Академия',
            title: 'Менеджер по подбору и адаптации персонала (рекрутер)',
            url: 'https://hr-academy.ru/podbor-adaptatsiya-personala',
            format: 'Онлайн',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Собственный',
            city: 'Москва',
            duration: 18,
            durationUnits: 'урок',
            price: 3200,
            skills: {
                'Мотивация сотрудников': 1,
                'Выстраивание внутренних коммуникаций': 1,
                'Модерация и фасилитация дискуссий': 1,
                'Управление корпоративной культурой': 1
            },
            requirements: {}
        },
        {
            id: 13,
            platform: 'HR-Академия',
            title: 'Менеджер по внутренним коммуникациям (PR- и Event-менеджер)',
            url: 'https://hr-academy.ru/vnutrennie-kommunikacii',
            format: 'Онлайн',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Собственный',
            city: 'Москва',
            duration: 16600,
            durationUnits: 'урок',
            price: 18,
            skills: {
                'Адаптация сотрудников': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1,
                'Проведение телефонных интервью': 1,
                'Программы адаптации персонала': 1
            },
            requirements: {
                'Мотивация сотрудников': 1,
                'Выстраивание внутренних коммуникаций': 1,
                'Модерация и фасилитация дискуссий': 1,
                'Управление корпоративной культурой': 1
            }
        },
        {
            id: 14,
            platform: 'HR-Академия',
            title: 'Менеджер по внутренним коммуникациям (PR- и Event-менеджер)',
            url: 'https://hr-academy.ru/vnutrennie-kommunikacii',
            format: 'Онлайн',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Собственный',
            city: 'Москва',
            duration: 18,
            durationUnits: 'урок',
            price: 3200,
            skills: {
                'Мотивация сотрудников': 1,
                'Выстраивание внутренних коммуникаций': 1,
                'Модерация и фасилитация дискуссий': 1,
                'Управление корпоративной культурой': 1
            },
            requirements: {}
        },
        {
            id: 15,
            platform: 'Moscow Business School',
            title: 'Практикум по кадровому планированию и бюджетированию',
            url: 'https://mbschool.ru/seminars/7454',
            format: 'Очная',
            hasTeacher: true,
            hasPractice: false,
            certificate: 'Собственный',
            city: 'Москва',
            duration: 1,
            durationUnits: 'день',
            price: 13400,
            skills: {
                'Кадровое планирование': 1,
                'Бюджетирование': 1
            },
            requirements: {
                'Кадровый учет': 2
            }
        },
        {
            id: 16,
            platform: 'Нетология',
            title: 'Разработка системы KPI',
            url: 'https://netology.ru/courses/razrabotka-sistemy-kpi',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 35,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Системы KPI': 1
            },
            requirements: {}
        },
        {
            id: 17,
            platform: 'Нетология',
            title: 'Бесконфликтное увольнение персонала',
            url: 'https://netology.ru/courses/beskonfliktnoe-uvolnenie-personala',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 70,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Увольнение сотрудников': 1
            },
            requirements: {}
        },
        {
            id: 18,
            platform: 'Нетология',
            title: 'Материальная и нематериальная мотивация сотрудников',
            url: 'https://netology.ru/courses/materialnaya-i-nematerialnaya-motivaciya',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 27,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Мотивация сотрудников': 1
            },
            requirements: {}
        },
        {
            id: 19,
            platform: 'Нетология',
            title: 'Методы развития и обучения сотрудников',
            url: 'https://netology.ru/courses/metodi-razvitiya-i-obucheniya-personala',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 92,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Развитие сотрудников': 1
            },
            requirements: {}
        },
        {
            id: 20,
            platform: 'Нетология',
            title: 'Как оценить кандидатов и сотрудников: построение кадровой политики',
            url: 'https://netology.ru/courses/kak-otsenit-kandidatov-i-sotrudnikov-postroenie-kadrovoi-politiki',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 118,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1,
                'Мотивация сотрудников': 1,
                'Разработка кадровых политик': 1
            },
            requirements: {}
        },
        {
            id: 21,
            platform: 'Нетология',
            title: 'Технология подбора персонала',
            url: 'https://netology.ru/courses/tehnologiya-podbora-personala',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 166,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1
            },
            requirements: {}
        },
        {
            id: 22,
            platform: 'Нетология',
            title: 'HR-брендинг как инструмент привлечения и удержания сотрудников',
            url: 'https://netology.ru/courses/hr-brending-kak-instrument-privlecheniya-i-uderzhaniya-sotrudnikov',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 134,
            durationUnits: 'минута',
            price: 490,
            skills: {
                'Формирование HR-бренда': 1,
                'Кадровая аналитика и статистика': 1
            },
            requirements: {}
        },
        {
            id: 23,
            platform: 'Нетология',
            title: 'Очный мастер-класс по HR-копирайтингу: как создать правильное описание вакансий',
            url: 'https://netology.ru/programs/hr-copywriting',
            format: 'Интенсив',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Нет',
            city: 'Москва',
            duration: 2,
            durationUnits: 'день',
            price: 9990,
            skills: {
                'Холодный поиск сотрудников': 1,
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 24,
            platform: 'Нетология',
            title: 'Очный мастер-класс по хедхантингу: технология и практика охоты за головам',
            url: 'https://netology.ru/programs/headhunting',
            format: 'Интенсив',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Нет',
            city: 'Москва',
            duration: 2,
            durationUnits: 'день',
            price: 9990,
            skills: {
                'Активный поиск сотрудников': 1,
                'Поиск IT сотрудников': 1
            },
            requirements: {}
        },
        {
            id: 25,
            platform: 'Нетология',
            title: 'Очный мастер-класс по таргетированной рекламе для рекрутеров',
            url: 'https://netology.ru/programs/hr-targeting',
            format: 'Интенсив',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Нет',
            city: 'Москва',
            duration: 2,
            durationUnits: 'день',
            price: 9990,
            skills: {
                'Холодный поиск сотрудников': 1,
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 26,
            platform: 'Нетология',
            title: 'Рекрутмент: инструменты и алгоритмы поиска идеальных кандидатов',
            url: 'https://netology.ru/programs/recruitment',
            format: 'Онлайн',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Государственного образца',
            city: 'Москва',
            duration: 2,
            durationUnits: 'месяц',
            price: 19900,
            skills: {
                'Поиск IT сотрудников': 1,
                'Выстраивание HR-процессов': 1,
                'Адаптация сотрудников': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1,
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 27,
            platform: 'Eduson',
            title: 'Как эффективно провести собеседование',
            url: 'https://www.eduson.tv/ru/courses/100',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Москва',
            duration: 19,
            durationUnits: 'минута',
            price: 605,
            skills: {
                'Проведение собеседований': 1
            },
            requirements: {}
        },
        {
            id: 28,
            platform: 'Coursera',
            title: '«Ловцы человеков» или социальные сети в медиа, бизнесе, рекрутинге и образовании',
            url: 'https://www.coursera.org/learn/sotsialnaya-set',
            format: 'Интерактивный',
            hasTeacher: true,
            hasPractice: true,
            certificate: 'Собственный',
            city: 'Томск',
            duration: 9,
            durationUnits: 'неделя',
            price: 1798,
            skills: {
                'Активный поиск сотрудников': 1,
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 29,
            platform: 'Coursera',
            title: '«Ловцы человеков» или социальные сети в медиа, бизнесе, рекрутинге и образовании',
            url: 'https://www.coursera.org/learn/sotsialnaya-set',
            format: 'Интерактивный',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: 'Томск',
            duration: 9,
            durationUnits: 'неделя',
            price: 1798,
            skills: {
                'Активный поиск сотрудников': 1,
                'Использование социальных инструментов подбора': 1
            },
            requirements: {}
        },
        {
            id: 30,
            platform: 'YouTube',
            title: 'Курс для HR. "Проективная оценка персонала"',
            url: 'https://www.youtube.com/watch?v=abnwSQjPbXA',
            format: 'Видео',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: '-',
            duration: 60,
            durationUnits: 'минута',
            price: 0,
            skills: {
                'Оценка сотрудников': 3
            },
            requirements: {
                'Оценка сотрудников': 2,
            }
        },
        {
            id: 31,
            platform: 'YouTube',
            title: 'Подбор персонала: современные приемы проведения собеседования',
            url: 'https://www.youtube.com/watch?v=88dvOWrwEec',
            format: 'Видео',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: '-',
            duration: 100,
            durationUnits: 'минута',
            price: 0,
            skills: {
                'Проведение собеседований': 1
            },
            requirements: {}
        },
        {
            id: 32,
            platform: 'YouTube',
            title: 'Трудовые книжки: особенности ведения',
            url: 'https://www.youtube.com/watch?v=G1uc3dX0ChE',
            format: 'Видео',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: '-',
            duration: 115,
            durationUnits: 'минута',
            price: 0,
            skills: {
                'Кадровый учет': 1
            },
            requirements: {}
        },
        {
            id: 33,
            platform: 'YouTube',
            title: 'Подбор персонала организации',
            url: 'https://www.youtube.com/watch?v=oLfCPaOiqAA',
            format: 'Видео',
            hasTeacher: false,
            hasPractice: false,
            certificate: 'Нет',
            city: '-',
            duration: 88,
            durationUnits: 'минута',
            price: 0,
            skills: {
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1,
                'Активный поиск сотрудников': 1,
                'Холодный поиск сотрудников': 1,
                'Оценка сотрудников': 1,
                'Проведение собеседований': 1
            },
            requirements: {}
        }
    ];
}

window.getCoursesList = getCoursesList;