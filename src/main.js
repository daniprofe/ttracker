import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';


import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.use(Ionic);

import store from '@/store';

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
