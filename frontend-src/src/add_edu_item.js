import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import addEduItemForm from './addEduItemForm.vue'

Vue.config.productionTip = false;

Vue.use( CKEditor );

new Vue({
  render: h => h(addEduItemForm),
}).$mount('#app');
