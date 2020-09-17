import Vue from 'vue'
import VueDisqus from 'vue-disqus'
import KupioxaPage from './KupioxaPage.vue'
import 'vue-prism-editor/dist/VuePrismEditor.css';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueDisqus);

window.vueInstance = new Vue({
    render: h => h(KupioxaPage),
}).$mount('#app-root');