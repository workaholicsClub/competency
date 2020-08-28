import Vue from 'vue';
import DucksPage from "./DucksPage";

Vue.config.productionTip = false;
Vue.config.devtools = true;

window.vueInstance = new Vue({
    render: h => h(DucksPage),
}).$mount('#app-root');