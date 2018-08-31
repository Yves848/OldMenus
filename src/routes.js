import Home from './components/Home.vue';
import Plats from './components/Plats/Plats.vue';
import Menus from './components/Menus/Menus.vue';
import Programmes from './components/Programmes/Programmes.vue';


export const routes = [{
        path: '/',
        component: Home
    },
    {
        path: '/plats',
        component: Plats
    },
    {
        path: '/menus',
        component: Menus
    },
    {
        path: '/programmes',
        component: Programmes
    }
];