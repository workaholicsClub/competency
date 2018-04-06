let professions = [
    {name: "Веб-разработчик (PHP)", code: "webDeveloper"},
    {name: "Тестировщик (Python)", code: "tester"},
    {name: "Менеджер web-проектов", code: "webProjectManager"}
];

let competencies = [
    {
        "id": 1,
        "code": "functionalProgramming",
        "name": "Функциональное программирование",
        "level1": "Владею понятиями алгоритма, именованных переменных и функций. Хорошо знаю базовые алгоритмы: линейный поиск, сортировка и бинарный поиск, обход многомерного массива, векторные и матричные операции",
        "level2": "Знаю что такое сложные типы данных, рекурсия, лямбда функции, карринг, функции высшего порядка. Знаю о чистоте функций и побочных эффектах. Имею опыт использования замыканий",
        "level3": "Понятие вычислимости. Знаю о машине Тьюринга, конечных автоматах. Хорошо ориентируюсь в классах вычислительной сложности задач. Знаю, что такое NP-полные задачи, могу привести пример одной из формулировок. Алгоритм NP-перебора",
        "level4": "Прекрасно понимаю, что такое параллельные алгоритмы (очередь, конвейер), транзакции, мертвая блокировка, состояние гонки. Знаю, что такое семафоры, мьютексы",
        "competencyGroupId": 1,
        "group": {
            "id": 1,
            "code": "programmingTheory",
            "name": "Теория программирования"
        },
        "professions": [
            {
                "id": 1,
                "code": "webDeveloper",
                "name": "Веб-разработчик (PHP)"
            }
        ],
        "skills": []
    },
    {
        "id": 2,
        "code": "oopProgramming",
        "name": "ОО программирование и проектирование",
        "level1": "Имею представление о базовых принципах ООП: абстракция, инкапсуляция, наследование, полиморфизм. Знаю об инкапсуляции данных и приватных методов. Знаю о понятиях интерфейса, абстрактного класса. Владею простейшими шаблонами проектирования: одиночка (singleton), фабрика (factory), фасад (fascade), адаптер (adapter)",
        "level2": "Владею расширением без наследования (композиция, полиморфные классы, шаблонные методы). Владею сериализацией и десериализацией объектов",
        "level3": "Уверенно владею другими шаблонами проектирования: наблюдатель (observer), посетитель (visitor), стратегия (strategy), реестр (registry). Имею опыт работы с DI-фрейморками. Владею основными принципами объектно-ориентированного программирования и проектирования: SOLID",
        "level4": "Уверенно знаю, могу применять и подбирать под нужды проекта архитектурные шаблоны: MVC, MVP, MVVM, DDD. Знаю как лучше организовать код по файлам, каталогам, пространствам имен",
        "competencyGroupId": 1,
        "group": {
            "id": 1,
            "code": "programmingTheory",
            "name": "Теория программирования"
        },
        "professions": [
            {
                "id": 1,
                "code": "webDeveloper",
                "name": "Веб-разработчик (PHP)"
            }
        ],
        "skills": [
            {
                "id": 23,
                "text": "Базовые понятия ООП",
                "additionalDescription": "Абстракция, инкапсуляция, наследование, полиморфизм",
                "competencyId": 2
            },
            {
                "id": 24,
                "text": "Инкапсуляция данных",
                "additionalDescription": "Приватные методы",
                "competencyId": 2
            },
            {
                "id": 25,
                "text": "Интерфейс",
                "additionalDescription": "",
                "competencyId": 2
            },
            {
                "id": 26,
                "text": "Абстрактный класс",
                "additionalDescription": "",
                "competencyId": 2
            },
            {
                "id": 27,
                "text": "Простые шаблоны проектирования",
                "additionalDescription": "Одиночка (singleton), фабрика (factory), фасад (fascade), адаптер (adapter)",
                "competencyId": 2
            },
            {
                "id": 28,
                "text": "Расширение без наследования",
                "additionalDescription": "Композиция, полиморфные классы, шаблонные методы",
                "competencyId": 2
            },
            {
                "id": 29,
                "text": "Сериализация объектов",
                "additionalDescription": "И десериализация",
                "competencyId": 2
            },
            {
                "id": 30,
                "text": "Дополнительные шаблоны проектирования",
                "additionalDescription": "Наблюдатель (observer), посетитель (visitor), стратегия (strategy), реестр (registry)",
                "competencyId": 2
            },
            {
                "id": 31,
                "text": "DI-фрейморки",
                "additionalDescription": "",
                "competencyId": 2
            },
            {
                "id": 32,
                "text": "Архитектурные принципы ООП",
                "additionalDescription": "SRP, OCP, LSP, ISP, DIP (SOLID), DRY, KISS, YAGNI",
                "competencyId": 2
            },
            {
                "id": 33,
                "text": "Архитектурные шаблоны",
                "additionalDescription": "MVC, MVP, MVVM, DDD",
                "competencyId": 2
            },
            {
                "id": 34,
                "text": "Организация и оформление кода",
                "additionalDescription": "По файлам, папкам, PSR-0, PSR-1, PSR-2, PSR-4",
                "competencyId": 2
            }
        ]
    },
    {
        "id": 3,
        "code": "codeQuality",
        "name": "Качество кода",
        "level1": "Знаю о необходимости уделять внимание качеству кода. Знаю, что заниматься ad hoc разработкой плохо. Понимаю, что необходимо возвращаться к написанным фрагментам кода для их улучшения. Знаю, что нужно уделять больше внимания именованию переменных, функций, объектов, таблиц. Представляю, что нужно переписывать код, чтобы сделать его более понятным и простым",
        "level2": "Имею представление об основных запахах кода: дублирование кода, мертвый код, операторы switch, стрельба дробью, завистливые функции и пр. Владею некоторыми техниками рефакторинга: извлечение/перемещение метода, класса, удаление посредника, инкапсуляция поля, замена параметров объектом, свертывание иерархии и пр. Периодически применяю эти техники для улучшения кода. Стараюсь придерживаться определенных стилей при написании кода: именование переменных, классов, форматирование",
        "level3": "Постоянно занимаюсь рефакторингом, имею 7-е чувство на запахи кода. Придерживаюсь правила бойскаута: \\\"Оставь поляну лучше, чем она была до тебя\\\". Пишу код, который можно повторно использовать. Не по наслышке знаком с практиками экстремального программирования, применяю их на практике",
        "level4": "Постоянно применяю TDD/BDD подход к разработке. Стараюсь добится высокой степени покрытия кода тестами. Достигаю продуктивности за счет улучшения качества, а не за счет его ухудшения. Консультируюсь и консультирую других разработчиков по способам улучшить код, сделать его более гибким. Считаю программирование и способность писать понятный, легко поддерживаемый и качественный код искусством",
        "competencyGroupId": 1,
        "group": {
            "id": 1,
            "code": "programmingTheory",
            "name": "Теория программирования"
        },
        "professions": [
            {
                "id": 1,
                "code": "webDeveloper",
                "name": "Веб-разработчик (PHP)"
            }
        ],
        "skills": [
            {
                "id": 35,
                "text": "Понятное именование",
                "additionalDescription": "Переменных, объектов, классов, функций, таблиц",
                "competencyId": 3
            },
            {
                "id": 36,
                "text": "Основные запахи кода",
                "additionalDescription": "Дублирование кода, мертвый код, операторы switch, стрельба дробью, завистливые функции и пр.",
                "competencyId": 3
            },
            {
                "id": 37,
                "text": "Базовые техники рефакторинга",
                "additionalDescription": "Извлечение/перемещение метода, класса, удаление посредника, инкапсуляция поля, замена параметров объектом, свертывание иерархии и пр.",
                "competencyId": 3
            },
            {
                "id": 38,
                "text": "Правило бойскаута",
                "additionalDescription": "Оставь поляну лучше, чем она была до тебя",
                "competencyId": 3
            },
            {
                "id": 39,
                "text": "Переиспользуемый код",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 40,
                "text": "Практики экстремального программирования",
                "additionalDescription": "Парное программирование, заказчик всегда рядом, непрерывная интеграция, частые релизы и пр.",
                "competencyId": 3
            },
            {
                "id": 41,
                "text": "Комментирование и документирование",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 42,
                "text": "Модульные тесты",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 43,
                "text": "TDD/BDD",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 44,
                "text": "Скорость через улучшение качества",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 45,
                "text": "Ревизия кода",
                "additionalDescription": "",
                "competencyId": 3
            },
            {
                "id": 46,
                "text": "Гибкость кода",
                "additionalDescription": "",
                "competencyId": 3
            }
        ]
    },
    {
        "id": 4,
        "code": "devTesting",
        "name": "Тестирование с точки зрения web-разработчика",
        "level1": "Знаю, что нужно запускать автотесты как можно чаще. Понимаю, что нужно делать автотесты самостоятельно, а не только полагаться на автотесты, сделанные коллегами. Знаю о том, что тестировать - задача не только тестировщика, но и разработчика",
        "level2": "Иногда разрабатываю модульные (unit) тесты. Имею опыт использования xUnit фреймфворка тестирования backend'а (phpunit) или frontend'а (jasmine, qunit, nightwatch, jest). Владею понятиями: тест-план, тест-дизайн, тест-анализ, умею писать хорошие баг-репорты для себя и других разработчиков. Понимаю отличия, преимущества и недостатки тестирования методами чёрного ящика, белого ящика, серого ящика",
        "level3": "Имею представление о классах эквивалентности. Имею представление и практический опыт написания других видов тестов: интеграционное, системное, функциональное, регрессионное, приемочное и пр. Имею опыт разработки некоторых из указанных видов тестов. Имею представление о средствах автоматизации тестирования браузера и UI (selenium, appium). Имею представление о Data-driven Testing",
        "level4": "Отлично владею методиками автоматизированного тестирования. Знаком с каким-либо фреймворком тестирования (py.test, xUnit frameworks). Имею представление о методиках и фреймворках Keyword-driven testing, Behavior-driven testing (behat), Model-based testing",
        "competencyGroupId": 1,
        "group": {
            "id": 1,
            "code": "programmingTheory",
            "name": "Теория программирования"
        },
        "professions": [
            {
                "id": 1,
                "code": "webDeveloper",
                "name": "Веб-разработчик (PHP)"
            }
        ],
        "skills": [
            {
                "id": 47,
                "text": "Частые запуски автотестов",
                "additionalDescription": "",
                "competencyId": 4
            },
            {
                "id": 48,
                "text": "Разработка модульных тестов",
                "additionalDescription": "",
                "competencyId": 4
            },
            {
                "id": 49,
                "text": "Cредства и фреймоврки тестирования PHP",
                "additionalDescription": "PHPUnit, Atoum, Simpletest, Behat, Mink, Codeception, Mockery",
                "competencyId": 4
            },
            {
                "id": 50,
                "text": "Средства и фреймворки тестирования JavaScript",
                "additionalDescription": "Jasmine, qunit, nightwatch, jest, chai, mocha, assert",
                "competencyId": 4
            },
            {
                "id": 51,
                "text": "Основные понятия тестирования",
                "additionalDescription": "Тест-план, тест-дизайн, тест-анализ. Методы чёрного ящика, белого и серого ящика",
                "competencyId": 4
            },
            {
                "id": 52,
                "text": "Написание баг-репортов",
                "additionalDescription": "",
                "competencyId": 4
            },
            {
                "id": 53,
                "text": "Классы эквивалентности",
                "additionalDescription": "",
                "competencyId": 4
            },
            {
                "id": 54,
                "text": "Прочие виды тестирования",
                "additionalDescription": "Интеграционное, системное, функциональное, регрессионное, приемочное и пр.",
                "competencyId": 4
            },
            {
                "id": 55,
                "text": "Средства автоматизации тестирования UI",
                "additionalDescription": "Selenium, appium",
                "competencyId": 4
            },
            {
                "id": 56,
                "text": "Data-driven тестирование",
                "additionalDescription": "",
                "competencyId": 4
            },
            {
                "id": 57,
                "text": "Методики автоматизированного тестирования",
                "additionalDescription": "Keyword-driven, Behavior-driven, Model-based",
                "competencyId": 4
            }
        ]
    },
    {
        "id": 5,
        "code": "taskAnalysis",
        "name": "Анализ задач",
        "level1": "Поручаю анализ проблемы другим людям (для этого есть системные и бизнес-аналитики). Выполняю задачу в том виде, в котором она описана. Ожидаю полное и подробное описание задачи, подробное техническое задание прежде, чем приступать к работе. Считаю, что ТЗ должно быть таким, чтобы при выполнении задачи не возникало вопросов",
        "level2": "Вплотную работаю с менеджером. Задаю вопросы, когда возникают. Запрашиваю информацию, когда не хватает. Стараюсь выполнить задачу как можно лучше с технической точки зрения. Бывает, не понимаю, кому и зачем нужна задача. Приступаю к разработке сразу, как только есть минимум необходимой информации",
        "level3": "Перед тем, как приступать к выполнению задачи, анализирую возможные варианты решения. Выбираю и делаю лучший вариант в пределах своих профессиональных компетенций.  Провожу декомпозицию задач, могу составить план и выстроить последовательность задач, которые необходимо выполнить, чтобы достичь требуемого результата. Занимаюсь синтезом общих решений из частных. Предпочитаю работать с хозяином задачи напрямую. К менеджеру обращаюсь за решением организационных вопросов",
        "level4": "Анализирую каждую задачу и учитываю не только технические факторы, но и бизнес-факторы, необходимости хозяина задачи. Анализирую затраты и риски. Стараюсь подходить к задаче со всех сторон. Подробно изучаю и пытаюсь выявить суть задачи, разобраться в домене знаний, привлечь экспертов и добраться до необходимых данных, в том случае, если имеющихся данных недостаточно. Могу предложить альтернативные варианты действий, в том случае, если в ходе анализа выяснилась невозможность или нецелесообразность выполнения задачи",
        "competencyGroupId": 1,
        "group": {
            "id": 1,
            "code": "programmingTheory",
            "name": "Теория программирования"
        },
        "professions": [
            {
                "id": 1,
                "code": "webDeveloper",
                "name": "Веб-разработчик (PHP)"
            }
        ],
        "skills": [
            {
                "id": 58,
                "text": "Работа с менеджментом",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 59,
                "text": "Инициативность в получении информации",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 60,
                "text": "Анализ возможных вариантов решения",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 61,
                "text": "Декомпозиция сложных задач",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 62,
                "text": "Планирование последовательности задач и шагов",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 63,
                "text": "Синтез общих решений",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 64,
                "text": "Анализ технических факторов",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 65,
                "text": "Анализ бизнес-факторов",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 66,
                "text": "Анализ затрат",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 67,
                "text": "Анализ рисков",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 68,
                "text": "Выявление сути задачи",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 69,
                "text": "Работа с экспертами предметной области",
                "additionalDescription": "",
                "competencyId": 5
            },
            {
                "id": 70,
                "text": "Предложение альтернативных вариантов",
                "additionalDescription": "",
                "competencyId": 5
            }
        ]
    }
];

let types = [
    {name: "Онлайн", code: "online"},
    {name: "Оффлайн", code: "offline"}
];

let fieldsData = [
    {code: 'professionCode', label: 'Профессия', type: 'select', value: '', variants: professions},
    {code: 'requiredCompetencies', label: 'Навыки', type: 'competency', value: [], variants: competencies},
    {code: 'free', label: 'Только бесплатные', type: 'checkbox', value: true},
    {code: 'dateStart', label: 'Дата начала', type: 'date', value: ''},
    {code: 'type', label: 'Тип', type: 'multiCheckbox', value: '', variants: types}
];

module.exports = function (selectedCompetenciesCodes, competencyRatings) {
    let newInstance = JSON.parse(JSON.stringify(fieldsData));
    if (selectedCompetenciesCodes) {
        newInstance[1].value = selectedCompetenciesCodes;
    }

    if (competencyRatings) {
        let competenciesWithRatings = [];

        competencies.forEach(function (skill) {
            let competencyCodes = Object.keys(competencyRatings);
            let competencyWithRating = JSON.parse(JSON.stringify(skill));

            competencyCodes.forEach(function (skillCode) {
                if (competencyWithRating.code === skillCode) {
                    competencyWithRating.rating = competencyRatings[skillCode].rating || false;
                    competencyWithRating.ratingPercent = competencyRatings[skillCode].ratingPercent || false;
                }
            });

            competenciesWithRatings.push(competencyWithRating);
        });

        newInstance[1].variants = competenciesWithRatings;
    }

    return newInstance;
};