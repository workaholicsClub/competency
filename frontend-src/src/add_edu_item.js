import Vue from 'vue'
import addEduItemForm from './addEduItemForm.vue'

Vue.config.productionTip = false;

new Vue({
  render: h => h(addEduItemForm),
}).$mount('#app');
