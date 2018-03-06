let professions = [
    {name: "Веб-разработчик (PHP)", code: "webDeveloper"},
    {name: "Тестировщик (Python)", code: "tester"},
    {name: "Менеджер web-проектов", code: "webProjectManager"}
];

let skills = [
    {name: "Навык А", code: "skillA"},
    {name: "Навык Б", code: "skillB"},
    {name: "Навык В", code: "skillC"}
];

let types = [
    {name: "Онлайн", code: "online"},
    {name: "Оффлайн", code: "offline"}
];

let fieldsData = [
    {code: 'professionCode', label: 'Профессия', type: 'select', value: '', variants: professions},
    {code: 'requiredCompetencies', label: 'Навыки', type: 'competency', value: [], variants: skills},
    {code: 'free', label: 'Только бесплатные', type: 'checkbox', value: true},
    {code: 'dateStart', label: 'Дата начала', type: 'date', value: ''},
    {code: 'type', label: 'Тип', type: 'multiCheckbox', value: '', variants: types}
];

module.exports = fieldsData;