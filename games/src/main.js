import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import Games from './Games.vue';
import router from './router';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Games)
}).$mount('#app')
