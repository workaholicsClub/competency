const h = require('hyperscript');
const menuViewFactory = require('../menu/View');

let FooterView = {
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
        let menuView = menuViewFactory(null, this.stylesManager, this.theme);

        let menuItems = [
            {href: '/', text: 'Главная'},
            {href: 'https://github.com/workaholicsClub/competency/', text: 'GitHub', target: '_blank'},
            {href: 'https://www.survio.com/survey/d/A1G9Y0H4O6S8W4X7X', text: 'Помогите нам пройдя опрос'},
        ];

        return menuView.createDOM({type: 'horizontal', menuItems: menuItems});
    },

    createDOM: function (viewModel) {
        let styles = this.createStyles();
        return h('div#footer.row.'+styles.classes.footer, this.createBottomMenu());
    }
};

/**
 * @param stylesManager
 * @returns {FooterView}
 */
module.exports = function (stylesManager) {
    let instance = Object.create(FooterView);
    instance.init(stylesManager);

    return instance;
};