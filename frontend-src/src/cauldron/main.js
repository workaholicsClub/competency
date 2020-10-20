import Vue from 'vue';
import Main from "./Main";

import replaceAll from "string.prototype.replaceall";
replaceAll.shim();

Vue.config.productionTip = false;
Vue.config.devtools = true;

window.vueInstance = new Vue({
    render: h => h(Main),
}).$mount('#app-root');