import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title 设置头部title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasRoles = store.getters.roles && JSON.stringify(store.getters.roles) !== "{}"

  if (hasToken) {
    // 有登录
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 有身份信息,存在了全局
      // try {
      if (!hasRoles) {
        await store.dispatch('user/logout')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      } else {
        let addRoutes = store.getters.addRoutes.length !== 0
        if (addRoutes) {
          next()
        } else {
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
          
          router.options.routes = accessRoutes;
          router.addRoutes(accessRoutes)
          next({ ...to })
        }
      }
      // get user info 拿到权限数组
      // const { roles } = await store.dispatch('user/getInfo')
      // localStorage.setItem("roles", "value");
      // localStorage.setItem("roles", "value");

      // generate accessible routes map based on roles
      // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

      // router.options.routes = accessRoutes;
      // router.addRoutes(accessRoutes)
      // } catch (error) {
      //   console.log(error, ';error')
      //   // remove token and go to login page to re-login
      //   await store.dispatch('user/logout')
      //   Message.error(error || 'Has Error')
      //   next(`/login?redirect=${to.path}`)
      //   NProgress.done()
      // }


    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
