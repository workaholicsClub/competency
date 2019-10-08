import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Catalog from './coursesListPage.vue'

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueAwesomeSwiper);

window.vueInstance = new Vue({
    render: h => h(Catalog),
    data: {
        neededSkills: [],
        existingSkills: [],
    },
    watch: {
        existingSkills: {
            handler() {
                this.catalog.existingSkills = this.existingSkills;
            },
            deep: true
        },
        neededSkills: {
            handler() {
                this.catalog.neededSkills = this.neededSkills;
            },
            deep: true
        }
    },
    methods: {
        loadCourses(filter) {
            this.catalog.loadCourses(filter);
        }
    },
    computed: {
        catalog() {
            return this.$children[0];
        }
    }
}).$mount('#app-root');

(function chromeOnAndroidUrlBarOverlayHack() {
    if (navigator.userAgent.indexOf("Chrome") !== -1 && navigator.userAgent.indexOf("Android") !== -1) {
        document.body.classList.add('chrome-on-android');
    }
})();