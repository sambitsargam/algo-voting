import { createRouter, createWebHistory } from 'vue-router'
import MyMatches from '../views/MyMatches.vue'
import UpcomingMatches from '../views/UpcomingMatches.vue'
import PageNotFound from '../views/PageNotFound.vue'

const routes = [
    {
        path: '/mymatches',
        name: 'My Vote',
        component: MyMatches,
    },
    {
        path: '/',
        name: 'Upcoming Voting',
        component: UpcomingMatches
    },
    {
        path: "/:pathMatch(.*)",
        name: '404',
        component: PageNotFound
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;