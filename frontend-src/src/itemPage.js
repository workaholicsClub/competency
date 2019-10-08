import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import ItemPage from './itemPage.vue'

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueAwesomeSwiper);

window.vueInstance = new Vue({
    render: h => h(ItemPage),
}).$mount('#app-root');