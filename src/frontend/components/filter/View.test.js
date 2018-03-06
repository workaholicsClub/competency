const filterViewFactory = require('./View');
const testFieldsData = require('../../mocks/filterFieldsData');

const h = require('hyperscript');
const jss = require('jss').default;

test('FilterView createDOM, render', function () {
    let rootElement = document.createElement('div');
    let view = filterViewFactory(null, jss);
    let viewWithElement = filterViewFactory(rootElement, jss);
    let fieldsData = testFieldsData;

    let viewDOM = view.createDOM(fieldsData);
    let viewHTML = viewDOM.outerHTML;

    viewWithElement.render(fieldsData);
    let rootElementHTML = rootElement.outerHTML;

    expect(viewDOM).toBeInstanceOf(HTMLElement);
    expect(viewHTML).not.toEqual(expect.stringContaining('null'));
    expect(rootElementHTML).not.toEqual(expect.stringContaining('null'));

    fieldsData.forEach(function (fieldData) {
        expect(viewHTML).toEqual(expect.stringContaining(fieldData.label));
        expect(rootElementHTML).toEqual(expect.stringContaining(fieldData.label));
    });
});

test('FilterView rootElement', function () {
    let view = filterViewFactory(null, jss);
    let rootElement = document.createElement('div');

    expect(view.getRootElement()).toBeNull();
    view.setRootElement(rootElement);
    expect(view.getRootElement()).toEqual(rootElement);

    view = filterViewFactory(rootElement, jss);
    expect(view.getRootElement()).toEqual(rootElement);
});

test('FilterView.createCompetencyField', function () {
    let view = filterViewFactory(null, jss);
    let fieldData = {
        code: 'neededCompetencies',
        label: 'Желаемые навыки',
        type: 'competency',
        value: ['skillB'],
        variants: [
            {name: "Навык А", code: "skillA"},
            {name: "Навык Б", code: "skillB"},
            {name: "Навык В", code: "skillC"}
        ]
    };
    let fieldDOM = view.createCompetencyField(fieldData);
    let labelDOM = fieldDOM[0];
    let inputDOM = fieldDOM[1];
    expect(labelDOM).toBeInstanceOf(HTMLElement);
    expect(inputDOM).toBeInstanceOf(HTMLElement);
    expect(inputDOM.getAttribute('data-type')).toEqual('competency');
    expect(inputDOM.getAttribute('data-code')).toEqual(fieldData.code);

    let labelHTML = labelDOM.outerHTML;
    expect(labelHTML).toEqual(expect.stringContaining(fieldData.label));

    let input = inputDOM.querySelector('input');
    expect(input).toBeInstanceOf(HTMLElement);
});

test('FilterView.createCheckboxField', function () {
   let view = filterViewFactory(null, jss);
   let fieldData = {
       code: 'free',
       label: 'Только бесплатные',
       type: 'checkbox',
       value: true
   };

    let fieldDOM = view.createCheckboxField(fieldData);
    expect(fieldDOM).toBeInstanceOf(HTMLElement);

    let fieldHTML = fieldDOM.outerHTML;
    expect(fieldHTML).toEqual(expect.stringContaining(fieldData.label));
    expect(fieldHTML).toEqual(expect.stringContaining(fieldData.code));

    let input = fieldDOM.querySelector('input');
    expect(input.getAttribute('name')).toEqual(fieldData.code);
    expect(input.getAttribute('checked')).toEqual('checked');
    expect(input.getAttribute('data-type')).toEqual('checkbox');
    expect(input.getAttribute('data-code')).toEqual(fieldData.code);

    fieldData.value = false;
    fieldDOM = view.createCheckboxField(fieldData);
    input = fieldDOM.querySelector('input');
    expect(input.getAttribute('checked')).toBeNull();
});

test('FilterView.createDateField', function () {
    let view = filterViewFactory(null, jss);
    let fieldData = {
        code: 'dateStart',
        label: 'Дата начала',
        type: 'date',
        value: ''
    };

    let fieldDOM = view.createDateField(fieldData);
    expect(fieldDOM[0]).toBeInstanceOf(HTMLElement);
    expect(fieldDOM[1]).toBeInstanceOf(HTMLElement);

    let fieldHTML = fieldDOM[0].outerHTML + fieldDOM[1].outerHTML;
    expect(fieldHTML).toEqual(expect.stringContaining(fieldData.label));

    let input = fieldDOM[1];
    expect(input.getAttribute('name')).toEqual(fieldData.code);
    expect(input.getAttribute('data-type')).toEqual('date');
    expect(input.getAttribute('data-code')).toEqual(fieldData.code);
    expect(input.value).toEqual("");

    let expectedDate = new Date(2018, 11, 3);
    fieldData.value = expectedDate;
    fieldDOM = view.createDateField(fieldData);
    input = fieldDOM[1];
    expect(input.value).toEqual(expectedDate.toString());
});

function getCheckboxexFromMulticheckboxDOM(fieldDOM) {
    let checkboxes = fieldDOM.reduce(function (accumulator, element) {
        let checkbox = element.querySelector('input');
        if (checkbox instanceof HTMLElement) {
            accumulator.push(checkbox);
        }

        return accumulator;
    }, []);

    return checkboxes;
}

test('FilterView.createMultiCheckboxField', function () {
    let view = filterViewFactory(null, jss);
    let fieldData = {
        code: 'homework',
        label: 'Домашние задания',
        type: 'multiCheckbox',
        value: '',
        variants: [
            {name: "Без домашних заданий", code: "noHomework"},
            {name: "С проверкой преподавателем", code: "teacherCheck"},
            {name: "С автоматизированной проверкой", code: "autoCheck"},
            {name: "Без проверки", code: "noCheck"}
        ]
    };

    let fieldDOM = view.createMultiCheckboxField(fieldData);
    expect(fieldDOM).toHaveLength(fieldData.variants.length + 1);

    let fieldsHTML = fieldDOM.reduce(function (accumulator, element) {
        return accumulator + element.outerHTML;
    }, '');

    expect(fieldsHTML).toEqual(expect.stringContaining(fieldData.label));
    fieldData.variants.forEach(function (variant) {
        expect(fieldsHTML).toEqual(expect.stringContaining(variant.name));
    });

    let checkboxes = getCheckboxexFromMulticheckboxDOM(fieldDOM);
    checkboxes.forEach(function (checkbox, index) {
        let expectedName = fieldData.code+'_'+(index+1);
        let expectedValue = fieldData.variants[index].code;
        expect(checkbox.getAttribute('name')).toEqual(expectedName);
        expect(checkbox.getAttribute('value')).toEqual(expectedValue);
        expect(checkbox.getAttribute('checked')).toBeNull();
        expect(checkbox.getAttribute('data-type')).toEqual('multicheckbox');
        expect(checkbox.getAttribute('data-code')).toEqual(fieldData.code);
    });

    fieldData.value = ['noHomework', 'autoCheck'];
    fieldDOM = view.createMultiCheckboxField(fieldData);
    checkboxes = getCheckboxexFromMulticheckboxDOM(fieldDOM);
    expect(checkboxes[0].getAttribute('checked')).toEqual('checked');
    expect(checkboxes[1].getAttribute('checked')).toBeNull();
    expect(checkboxes[2].getAttribute('checked')).toEqual('checked');
    expect(checkboxes[3].getAttribute('checked')).toBeNull();
});

test('FilterView.createSelectField', function () {
    let view = filterViewFactory(null, jss);
    let fieldData = {
        code: 'professionCode',
        label: 'Профессия',
        type: 'select',
        value: '',
        variants: [
            {name: "Веб-разработчик (PHP)", code: "webDeveloper"},
            {name: "Тестировщик (Python)",  code: "tester"},
            {name: "Менеджер web-проектов", code: "webProjectManager"}
        ]
    };

    let fieldDOM = view.createSelectField(fieldData);
    expect(fieldDOM[0]).toBeInstanceOf(HTMLElement);
    expect(fieldDOM[1]).toBeInstanceOf(HTMLElement);

    let fieldHTML = fieldDOM[0].outerHTML + fieldDOM[1].outerHTML;
    expect(fieldHTML).toEqual(expect.stringContaining(fieldData.label));

    let select = fieldDOM[1];
    expect(select.getAttribute('name')).toEqual(fieldData.code);
    expect(select.getAttribute('data-type')).toEqual('select');
    expect(select.getAttribute('data-code')).toEqual(fieldData.code);

    let options = select.querySelectorAll('option');
    options.forEach(function (option, index) {
        if (index === 0) {
            expect(option.value).toEqual("");
            expect(option.getAttribute('selected')).toBeNull();
        }
        else {
            let optionData = fieldData.variants[index-1];
            let optionHTML = option.outerHTML;

            expect(option.value).toEqual(optionData.code);
            expect(optionHTML).toEqual(expect.stringContaining(optionData.name));
            expect(option.getAttribute('selected')).toBeNull();
        }
    });

    fieldData.value = 'tester';
    fieldDOM = view.createSelectField(fieldData);
    options = fieldDOM[1].querySelectorAll('option');

    expect(options[0].getAttribute('selected')).toBeNull();
    expect(options[1].getAttribute('selected')).toBeNull();
    expect(options[2].getAttribute('selected')).toEqual('selected');
    expect(options[3].getAttribute('selected')).toBeNull();
});

test('FieldsView getAllFields', function () {
    let testFieldsCount = 6;
    let rootElement = h('div');

    let view = filterViewFactory(rootElement, jss);
    view.render(testFieldsData);

    let renderedFields = view.getAllFields();
    expect(renderedFields).toHaveLength(testFieldsCount);
});

test('FieldsView fieldValues', function () {
    let expectedSelectValue = 'webDeveloper';
    let expectedCompetencyValue = ['skillB'];
    let expectedCheckboxValue = true;
    let dateValue = new Date(2018, 11, 3);
    let expectedDateValue = dateValue.toString();
    let expectedMultiCheckboxValue = ['offline'];

    let fieldsData = JSON.parse(JSON.stringify(testFieldsData));

    fieldsData[0].value = expectedSelectValue;
    fieldsData[1].value = expectedCompetencyValue;
    fieldsData[2].value = expectedCheckboxValue;
    fieldsData[3].value = expectedDateValue;
    fieldsData[4].value = expectedMultiCheckboxValue;

    let rootElement = h('div');
    let view = filterViewFactory(rootElement, jss);
    view.render(fieldsData);

    expect( view.getFieldValue(fieldsData[0].code) ).toEqual(expectedSelectValue);
    expect( view.getFieldValue(fieldsData[1].code) ).toEqual(expectedCompetencyValue);
    expect( view.getFieldValue(fieldsData[2].code) ).toEqual(expectedCheckboxValue);
    expect( view.getFieldValue(fieldsData[3].code) ).toEqual(expectedDateValue);
    expect( view.getFieldValue(fieldsData[4].code) ).toEqual(expectedMultiCheckboxValue);
});