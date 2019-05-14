import Vue from 'vue'
import { IonicVueRouter } from '@ionic/vue';

import Tracker from '@/views/Tracker.vue';
import LoginOrRegister from '@/views/LoginOrRegister.vue'

Vue.use(IonicVueRouter)

export default new IonicVueRouter({

    mode: 'history',
    base: process.env.BASE_URL,

    routes: [

        {
            path: '/',
            name: 'tracker',
            component: Tracker
        },

        {
            path: '/login',
            name: 'LoginOrRegister',
            component: LoginOrRegister
        }

    ]

})
