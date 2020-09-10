import Vue from 'vue';
import SlopePage from "./SlopePage";

Vue.config.productionTip = false;
Vue.config.devtools = true;

window.vueInstance = new Vue({
    render: h => h(SlopePage),
}).$mount('#app-root');