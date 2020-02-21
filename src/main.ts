import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import './env.js';
import '../src/utils/feth';
import session, { escapeCheckSession$ } from './session';
import 'element-ui/lib/theme-chalk/index.css';
import { global } from './utils/mixin';
Vue.use(ElementUI);
Vue.use(Router);
Vue.mixin(global);
Vue.mixin(session);
Vue.config.productionTip = false;

escapeCheckSession$().then((router: any) => {
  console.log(router);
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
});
