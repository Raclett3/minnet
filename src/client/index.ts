import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';
import './static/index.html';
import './static/style.css';
import Index from './views/Index.vue';
import NotFound from './views/NotFound.vue';
import SignIn from './views/SignIn.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/signin', component: SignIn },
    { path: '*', component: NotFound },
  ],
});

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app');
