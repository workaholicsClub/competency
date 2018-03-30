const h = require('hyperscript');

const Selectivity = require('selectivity');
require('selectivity/dropdown');
require('selectivity/inputs/multiple');
require('selectivity/templates');

/**
 * @typedef {Object} FieldData
 * @property {string} code
 * @property {string} label
 * @property {string} type
 * @property value
 * @property {Array} variants
 */

/**
 * @typedef {Object} SelectivityHash
 * @property {string} id
 * @property {string} text
 */

let FilterView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
        this.selectivityInstances = {};
        this.styles = this.createStyles();
    },

    createStyles: function () {
        let styles = {
            buttons: {
                'float': 'right'
            },
            levelTrigger: {
                'color': '#fff',
                'text-decoration': 'none',
                'border-bottom': '1px dashed #fff',
                '&:hover': {
                    'color': '#fff',
                    'text-decoration': 'none',
                    'border-bottom': '1px dashed #fff',
                },
                '&:visited': {
                    'color': '#fff'
                }
            }
        };

        return this.stylesManager.createStyleSheet(styles).attach();
    },

    setRootElement: function (newRootElement) {
        this.element = newRootElement;
    },

    getRootElement: function () {
        return this.element;
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createCompetencyField: function (fieldData) {
        let fieldContainer = h('div', {attrs: {'data-type': 'competency', 'data-code': fieldData.code}});

        let selectivityItems = fieldData.variants.map(function (fieldDataItem) {
            return {
                id: fieldDataItem.code,
                text: fieldDataItem.name
            };
        });

        let selectivityInstance = new Selectivity.Inputs.Multiple({
            element: fieldContainer,
            name: fieldData.code,
            items: selectivityItems,
            removable: true,
            value: fieldData.value,
            templates: {
                multipleSelectedItem: function (options) {
                    let extraClass = options.highlighted ? '.highlighted' : '';

                    let removeButton = h('a.selectivity-multiple-selected-item-remove',
                        h('i.material-icons', 'close')
                    );

                    let levelButton = h('a.setLevel',
                        h('i.material-icons', 'settings')
                    );

                    let pillText = h('span', options.text);

                    let skillPill = h('span.selectivity-multiple-selected-item' + extraClass, {attrs: {'data-item-id': options.id}},
                        (options.removable ? removeButton : null),
                        levelButton,
                        pillText
                    );

                    return skillPill.outerHTML;
                }
            }
        });

        this.selectivityInstances[fieldData.code] = selectivityInstance;

        return [
            h('label', {attrs: {for: fieldData.code}}, fieldData.label),
            fieldContainer
        ];
    },

    /**
     * @param {string} variantCode
     * @param {string} variantText
     * @returns {HTMLElement}
     */
    createSelectedCompetencyPill: function (variantCode, variantText) {
        let classes = this.styles.classes;

        let removeButton = h('button.close.text-white',
            h('span', '\u00d7')
        );

        let skillText = h('span.font-weight-bold.mb-0.skillName', variantText);
        let buttons = h('div.buttons.' + classes.buttons,
            removeButton
        );
        let header = h('p.mb-0',
            skillText,
            buttons
        );

        let levelText = h('small.mb-0',
            h('p.mb-0', 'Уровень владения: '),
            h('a.'+classes.levelTrigger, {href: '#'}, 'определить')
        );

        let skillPill = h('div.bg-primary.text-white.p-2.mt-2.selectedItem', {attrs: {'data-item-code': variantCode}},
            header,
            levelText
        );

        return skillPill;
    },

    createCometencySelectOption: function (variantCode, variantText) {
        return h('option', {value: variantCode}, variantText);
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createAltCompetencyField: function (fieldData) {
        let selectedSkills = fieldData.variants.reduce(function (accumulator, variant) {
            let isSelected = fieldData.value.indexOf(variant.code) !== -1;
            if (isSelected) {
                accumulator.push(variant);
            }
            return accumulator;
        }, []);

        let notSelectedSkills = fieldData.variants.reduce(function (accumulator, variant) {
            let notSelected = fieldData.value.indexOf(variant.code) === -1;
            if (notSelected) {
                accumulator.push(variant);
            }
            return accumulator;
        }, []);

        let view = this;

        return h('div', {attrs: {'data-type': 'competency', 'data-code': fieldData.code}},
            h('label', {attrs: {for: fieldData.code}}, fieldData.label),
            h('select#'+fieldData.code+'.form-control', {name: fieldData.code, attrs: {'data-type': 'competency', 'data-code': fieldData.code}},
                h('option', {value: ''}, 'Не выбрано'),
                notSelectedSkills.map(function (variant) {
                    return view.createCometencySelectOption(variant.code, variant.name);
                })
            ),
            h('div.selectedContainer',
                selectedSkills.map(function (variant) {
                    return view.createSelectedCompetencyPill(variant.code, variant.name);
                })
            )
        );
    },

    getFieldCodeBySubElement: function (element) {
        let fieldElement = element.closest('[data-type=competency]');
        return fieldElement.getAttribute('data-code');
    },

    /**
     * @param {HTMLElement} buttonElement
     */
    getSkillCodeByRemoveButton: function (buttonElement) {
        let skillElement = buttonElement.closest('.selectedItem');
        return skillElement.getAttribute('data-item-code');
    },

    getSkillCodeBySelect: function (selectElement) {
        return selectElement.value;
    },

    getFieldCodeByRemoveButton: function (buttonElement) {
        return this.getFieldCodeBySubElement(buttonElement);
    },

    getFieldCodeBySelect: function (selectElement) {
        return this.getFieldCodeBySubElement(selectElement);
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createCheckboxField: function (fieldData) {
        let inputAttrs = {'data-type': 'checkbox', 'data-code': fieldData.code};
        if (fieldData.value === true) {
            inputAttrs['checked'] = 'checked';
        }

        return h('div.form-check',
            h('input#'+fieldData.code+'.form-check-input', {name: fieldData.code, type: 'checkbox', attrs: inputAttrs}),
            h('label.form-check-label', {attrs: {for: fieldData.code}}, fieldData.label)
        );
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createMultiCheckboxField: function (fieldData) {
        let label = h('label', fieldData.label);
        let checkboxes = fieldData.variants.map(function (variant, index) {
            let humanIndex = index + 1;
            let fieldNameId = fieldData.code + '_' + humanIndex;
            let isChecked = fieldData.value.indexOf(variant.code) !== -1;
            let inputAttrs = {
                'data-type': 'multicheckbox',
                'data-code': fieldData.code,
                value: variant.code
            };

            if (isChecked) {
                inputAttrs['checked'] = 'checked';
            }

            return h('div.form-check',
                h('input#' + fieldNameId + '.form-check-input', {
                    name: fieldNameId,
                    type: 'checkbox',
                    attrs: inputAttrs
                }),
                h('label.form-check-label', {attrs: {for: fieldNameId}}, variant.name)
            );
        });

        checkboxes.unshift( label );

        return checkboxes;
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createDateField: function (fieldData) {
        return [
            h('label', {attrs: {for: fieldData.code}}, fieldData.label),
            h('input#'+fieldData.code+'.form-control', {name: fieldData.code, type: 'date', attrs: {
                'data-type': 'date',
                'data-code': fieldData.code,
                value: fieldData.value
            }})
        ];
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement[]}
     */
    createSelectField: function (fieldData) {
        return [
            h('label', {attrs: {for: fieldData.code}}, fieldData.label),
            h('select#'+fieldData.code+'.form-control', {name: fieldData.code, attrs: {'data-type': 'select', 'data-code': fieldData.code}},
                h('option', {value: ''}, 'Не выбрано'),
                fieldData.variants.map(function (variant) {
                    let isSelected = variant.code === fieldData.value;
                    let attrs = {};
                    if (isSelected) {
                        attrs['selected'] = 'selected';
                    }

                    return h('option', {value: variant.code, attrs: attrs}, variant.name);
                })
            )
        ];
    },

    /**
     * @param {FieldData} fieldData
     * @returns {HTMLElement}
     */
    createFieldGroup: function (fieldData) {
        let input;

        switch (fieldData.type.toLowerCase()) {
            case 'competency':
                input = this.createAltCompetencyField(fieldData);
            break;
            case 'checkbox':
                input = this.createCheckboxField(fieldData);
            break;
            case 'date':
                input = this.createDateField(fieldData);
            break;
            case 'multicheckbox':
                input = this.createMultiCheckboxField(fieldData);
            break;
            case 'select':
                input = this.createSelectField(fieldData);
            break;
        }

        return h('div.form-group', input);
    },

    /**
     * @param {FieldData[]} fields
     * @returns {HTMLElement}
     */
    createDOM: function (fields) {
        return h('form#filter',
            fields.map(this.createFieldGroup, this)
        );
    },

    /**
     * @param {FieldData[]} fields
     * @returns {HTMLElement}
     */
    render: function (fields) {
        let filterDOM = this.createDOM(fields);
        this.element.appendChild(filterDOM);
    },

    /**
     * @returns {any | NodeListOf<Element> | *}
     */
    getAllFields: function () {
        return this.element.querySelectorAll('input[data-type], select[data-type], text[data-type]');
    },

    /**
     * @param {String} fieldCode
     * @returns {HTMLElement}
     */
    queryField: function (fieldCode) {
        return this.element.querySelector('[data-code="'+fieldCode+'"]');
    },

    /**
     * @param {String} fieldCode
     * @param {HTMLElement} fieldElement
     * @returns {String[]}
     */
    getCompetencyFieldValue: function (fieldCode, fieldElement) {
        let selectivityInstance = this.selectivityInstances[fieldCode];
        /**
         * @type {SelectivityHash[]}
         */
        let selectivityData = selectivityInstance.getData();

        let selectedIds = selectivityData.reduce(function (accumulator, item) {
            accumulator.push(item.id);
            return accumulator;
        }, []);

        return selectedIds;
    },

    getAltCompetencyFieldValue: function (fieldCode, fieldElement) {
        if (!fieldElement) {
            fieldElement = this.queryField(fieldCode);
        }

        let selectedItems = fieldElement.querySelectorAll('.selectedItem');
        let value = [];
        for (let index = 0; index < selectedItems.length; index++) {
            let selectedItem = selectedItems[index];
            value.push(selectedItem.getAttribute('data-item-code'));
        }

        return value;
    },

    /**
     * @param {String} fieldCode
     * @param {HTMLElement} fieldElement
     */
    getCheckboxFieldValue: function (fieldCode, fieldElement) {
        if (!fieldElement) {
            fieldElement = this.queryField(fieldCode);
        }

        return fieldElement.checked;
    },

    /**
     * @param {String} fieldCode
     * @param {HTMLElement} fieldElement
     */
    getDateFieldValue: function (fieldCode, fieldElement) {
        if (!fieldElement) {
            fieldElement = this.queryField(fieldCode);
        }

        return fieldElement.value;
    },

    /**
     * @param {String} fieldCode
     * @param {HTMLElement} fieldElement
     * @returns {Number[]}
     */
    getMultiCheckboxFieldValue: function (fieldCode, fieldElement) {
        let variants = this.element.querySelectorAll('[data-code="'+fieldCode+'"]');

        let checkedIndexes = [];

        variants.forEach(function (checkbox) {
            if (checkbox.checked) {
                checkedIndexes.push(checkbox.getAttribute('value'));
            }
        });

        return checkedIndexes;
    },

    /**
     * @param {String} fieldCode
     * @param {HTMLElement} fieldElement
     * @returns {String}
     */
    getSelectFieldValue: function (fieldCode, fieldElement) {
        if (!fieldElement) {
            fieldElement = this.queryField(fieldCode);
        }

        return fieldElement.value || "";
    },

    getFieldValue: function (fieldCode) {
        let fieldElement = this.queryField(fieldCode);
        let fieldType = fieldElement.getAttribute('data-type').toLowerCase();
        let fieldValue = null;

        switch (fieldType) {
            case 'competency':
                fieldValue = this.getAltCompetencyFieldValue(fieldCode, fieldElement);
            break;
            case 'checkbox':
                fieldValue = this.getCheckboxFieldValue(fieldCode, fieldElement);
            break;
            case 'date':
                fieldValue = this.getDateFieldValue(fieldCode, fieldElement);
            break;
            case 'multicheckbox':
                fieldValue = this.getMultiCheckboxFieldValue(fieldCode, fieldElement);
            break;
            case 'select':
                fieldValue = this.getSelectFieldValue(fieldCode, fieldElement);
            break;
        }

        return fieldValue;
    },

    /**
     * @returns {NodeList}
     */
    getAllCompetencyFieldSelectors: function () {
        return this.element.querySelectorAll('[data-type=competency] select');
    },

    /**
     * @returns {NodeList}
     */
    getAllSkillsRemoveButtons: function () {
        return this.element.querySelectorAll('[data-type=competency] .selectedItem .close');
    },

    /**
     * @returns {HTMLElement}
     */
    getSkillRemoveButton: function (fieldCode, skillCode) {
        return this.element.querySelector('[data-type=competency][data-code='+fieldCode+'] .selectedItem[data-item-code='+skillCode+'] .close');
    },

    getClickedSkillCode: function (fieldCode) {
        let fieldElement = this.queryField(fieldCode);
        let selectElement = fieldElement.querySelector('select');
        return this.getSkillCodeBySelect(selectElement);
    },

    moveSelectedCompetency: function (fieldCode) {
        let fieldElement = this.queryField(fieldCode);
        let selectedContainer = fieldElement.querySelector('.selectedContainer');

        let skillCode = this.getClickedSkillCode(fieldCode);
        let selectedOption = fieldElement.querySelector('option[value='+skillCode+']');
        let selectedDOM = this.createSelectedCompetencyPill(selectedOption.value, selectedOption.textContent);

        selectedOption.remove();
        selectedContainer.appendChild(selectedDOM);
    },

    removeSelectedCompetency: function (fieldCode, skillCode) {
        let competencyElement = this.queryField(fieldCode);
        let select = competencyElement.querySelector('select');
        let selectedElement = competencyElement.querySelector('.selectedItem[data-item-code='+skillCode+']');
        let skillNameElement = selectedElement.querySelector('.skillName');

        let variantCode = selectedElement.getAttribute('data-item-code');
        let variantText = skillNameElement.textContent;

        let selectOption = this.createCometencySelectOption(variantCode, variantText);
        select.appendChild(selectOption);
        selectedElement.remove();
    }
};

/**
 * @param {HTMLElement} element
 * @param stylesManager
 * @returns {FilterView}
 */
module.exports = function (element, stylesManager) {
    let instance = Object.create(FilterView);
    instance.init(element, stylesManager);

    return instance;
};