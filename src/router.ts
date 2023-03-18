import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tensorflow'
  },
  // {
  //   path: '/faceMesh',
  //   component: () => import('./components/FaceMesh.vue')
  // },
  // {
  //   path: '/faceDetection',
  //   component: () => import('./components/FaceDetection.vue')
  // },
  {
    path: '/tensorflow',
    component: () => import('./components/Tensorflow.vue')
  },
  // {
  //   path: '/kalidokit',
  //   component: () => import('./components/Kalidokit.vue')
  // }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router