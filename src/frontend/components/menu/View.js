const h = require('hyperscript');

var MenuView = {
    init: function (element, stylesManager) {
        this.element = element;
        this.stylesManager = stylesManager;
    },

    createStyles: function (type) {
        var styles = {
            vertical: {
                block: {'width': '300px', 'float': 'right', 'position': 'absolute', 'top': 0, 'right': 0},
                element: {'display': 'block', 'margin': '0 0 0 10px'}
            },
            horizontal: {
                block: {},
                element: {'float': 'left', 'display': 'block', 'margin': '0 10px 0 0'}
            }
        };

        return this.stylesManager.createStyleSheet(styles[type]).attach();
    },

    createDOM: function (viewModel) {
        var styles = this.createStyles(viewModel.type);

        return h('ul.' + styles.classes.block,
            viewModel.menuItems.map(function (item) {
                return h('li.' + styles.classes.element,
                    h('a', {href: item.href}, item.text)
                );
            })
        );
    },

    render: function (viewModel) {
        var moduleElement = this.createDOM(viewModel);
        this.element.innerHTML = moduleElement.outerHTML;
    }
};

module.exports = function (element, stylesManager) {
    var instance = Object.create(MenuView);
    instance.init(element, stylesManager);
    return instance;
};