import Enums from "./Enums";

export default {
    fields: [
        {
            title: 'Типы',
            code: 'type',
            values: Enums.types
        },
        {
            title: 'Для кого',
            code: 'audience',
            values: Enums.audience
        },
        {
            title: 'Формат курса',
            code: 'format',
            values: Enums.course.formats
        },
        {
            title: 'Форма занятий',
            code: 'form',
            values: Enums.course.forms
        },
        {
            title: 'Стоимость',
            code: 'price',
            values: [
                {code: '0', title: 'Бесплатный'},
                {code: '1500', title: 'Недорогой'},
            ]
        },
        {
            title: 'Практика',
            code: 'hasPractice',
            values: [
                {code: '1', title: 'Есть'},
                {code: '0', title: 'Нет'},
            ]
        },
        {
            title: 'Сертификат',
            code: 'certificate',
            values: Enums.course.certificates
        },
        {
            title: 'Обучение с преподавателем',
            code: 'hasTeacher',
            values: [
                {code: '1', title: 'Да'},
                {code: '0', title: 'Нет'},
            ]
        },
        {
            title: 'Оказание помощи в трудоустройстве',
            code: 'jobPlacement',
            values: [
                {code: '1', title: 'Да'},
                {code: '0', title: 'Нет'},
            ]
        },
    ],
}