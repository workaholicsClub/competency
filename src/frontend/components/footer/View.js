const h = require('hyperscript');
const menuViewFactory = require('../menu/View');

var FooterView = {
    init: function (stylesManager) {
        this.stylesManager = stylesManager;
    },

    createStyles: function () {
        return this.stylesManager.createStyleSheet({
            'footer': {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '60px',
                'line-height': '60px'
            }
        }).attach();
    },

    createBottomMenu: function () {
        var menuView = menuViewFactory(null, this.stylesManager, this.theme);

        var menuItems = [
            {href: '/', text: 'Главная'}
        ];

        return menuView.createDOM({type: 'horizontal', menuItems: menuItems});
    },

    createDOM: function (viewModel) {
        var styles = this.createStyles();
        return h('div#footer.row.'+styles.classes.footer, this.createBottomMenu());
    }
};

/**
 * @param stylesManager
 * @returns {FooterView}
 */
module.exports = function (stylesManager) {
    var instance = Object.create(FooterView);
    instance.init(stylesManager);

    return instance;
};