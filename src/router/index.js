import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/createConnection',
    name: 'Create Connection',
    component: () => import('../views/NewConnection.vue')
  },
  {
    path: '/updateConnection/:connId',
    name: 'Update Connection',
    component: () => import('../views/EditConnection.vue'),
    props: true,
  },
  {
    path: '/createMetadates',
    name: 'Create Metadates',
    component: ()=> import('../views/CreateMetadates.vue'),
    props: true,
  },
  {
    path: '/metadates',
    name: 'Metadates',
    component: () => import('../views/Metadates.vue'),
  },
  {
    path: '/deleteMetadates',
    name: 'Delete Metadates',
    component: () => import('../views/DeleteMetadates.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
