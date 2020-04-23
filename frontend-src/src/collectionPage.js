import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueDisqus from 'vue-disqus'
import CollectionPage from './collectionPage.vue'

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueAwesomeSwiper);
Vue.use(VueDisqus);

window.vueInstance = new Vue({
    render: h => h(CollectionPage),
}).$mount('#app-root');