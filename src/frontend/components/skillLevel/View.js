const h = require('hyperscript');

let SkillLevelView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
    },

    /**
     * @returns {HTMLElement}
     */
    getRootElement: function () {
        return this.element;
    },

    /**
     * @param {HTMLElement} element
     */
    setRootElement: function (element) {
        this.element = element;
    },

    /**
     * @param {Element} sliderInput
     * @param {string[]} levelTexts
     */
    updateSkillText: function (sliderInput, levelTexts) {
        let rowElement = sliderInput.closest('tr');
        let textElement = rowElement.querySelector('span');
        let newText = levelTexts[ sliderInput.value ];

        textElement.innerHTML = newText;
    },

    /**
     * @returns {NodeList}
     */
    getAllSkillSliders: function () {
        return this.element.querySelectorAll('input[type=range]');
    },

    getLevelSkillAnswers: function () {
        let answers = [];

        this.getAllSkillSliders().forEach(function (sliderElement) {
            answers.push( parseInt(sliderElement.value) );
        });

        return answers;
    },

    createSkillsTable: function (viewModel) {
        return h('div.table-responsive-sm.col-md-12',
            h('table.table.table-bordered.table-hover',
                h('thead',
                    h('tr.d-flex',
                        h('th.col-6', {attrs: {scope: 'col'}}, 'Навык'),
                        h('th.col-6', {attrs: {scope: 'col', colspan: '2'}}, 'Уровень владения')
                    )
                ),
                h('tbody',
                    viewModel.skills.map(function (skill, index) {
                        return h('tr#skill'+index+'.d-flex',
                            h('td.col-6.skillName', {attrs: {scope: 'row'}}, skill.text, h('br'),
                                h('small.text-muted.skillDescription', skill.additionalDescription)
                            ),
                            h('td.col-3',
                                h('input.skillInput', {name: 'skill'+index, type: 'range', attrs: {
                                    min: '0',
                                    max: '3',
                                    value: skill.answer,
                                    step: '1'
                                }})
                            ),
                            h('td.col-3.skillAnswer',
                                h('span', skill.answerText)
                            )
                        );
                    })
                )
            )
        );
    },

    createDOM: function (viewModel) {
        return this.createSkillsTable(viewModel);
    },

    render: function (viewModel) {
        let moduleDOM = this.createDOM(viewModel);
        this.element.innerHTML = moduleDOM.outerHTML;
    }
};

/**
 * @param {HTMLElement} DOMelement
 * @param stylesManager
 * @returns {SkillLevelView}
 */
module.exports = function (DOMelement, stylesManager) {
    let instance = Object.create(SkillLevelView);
    instance.init(DOMelement, stylesManager);

    return instance;
};