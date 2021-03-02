import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Login from '@/page/Login'
import DiaryDetial from '@/page/DiaryDetial'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/home',
      component: Home
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/diaryDetial',
      name: 'diaryDetial',
      component: DiaryDetial
    },
     {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
