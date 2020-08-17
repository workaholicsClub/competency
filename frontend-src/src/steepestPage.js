import Vue from 'vue'
import SpeepestPage from './SpeepestPage.vue'

Vue.config.productionTip = false;
Vue.config.devtools = true;

window.vueInstance = new Vue({
    render: h => h(SpeepestPage),
}).$mount('#app-root');