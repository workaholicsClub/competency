import Vue from 'vue'
import Catalog from './coursesListPage.vue'
import Fragment from 'vue-fragment'

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(Fragment.Plugin);

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