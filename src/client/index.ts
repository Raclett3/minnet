import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';
import './static/index.html';
import Index from './views/Index.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{ path: '/', component: Index }],
});

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app');
