import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from "../views/Home";
import MicroPetka from "../components/MicroPetka";

import PetkaIntro from "../views/micropetka/Intro";
import PetkaTask from "../views/micropetka/Task";
import PetkaData from "../views/micropetka/Data";
import PetkaCheck from "../views/micropetka/Check";
import PetkaSuccess from "../views/micropetka/Success";

Vue.use(VueRouter);

const routes = [
    {
        path: '',
        name: 'home',
        component: Home,
    },
    {
        path: '/micropetka',
        name: 'micropetka',
        component: MicroPetka,
        children: [
            {path: '', component: PetkaIntro},
            {path: 'task', component: PetkaTask},
            {path: 'data', component: PetkaData},
            {path: 'check', component: PetkaCheck},
            {path: 'success', component: PetkaSuccess},
        ]
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    routes
})

export default router
