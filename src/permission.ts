import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import settings from './settings'
import { getUserInfo } from '@/api/users'
import { getDbSchema } from '@/api/schema'
import { AppModule } from '@/store/modules/app'
import _ from 'lodash'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

const getPageTitle = (pageName: string) => {
  return `${pageName} - ${settings.title}`
  // return `${settings.title}`
}

router.beforeEach(async(to: Route, from: Route, next: any) => {
  // Start progress bar
  NProgress.start()

  // Determine whether the user has logged in
  if (UserModule.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    }
    console.log(UserModule.roles)
    if (UserModule.roles.length === 0) {
      try {
        const user = await getUserInfo()
        if (user.data) {
          console.log(user.data)
          if (!user.data.shop_id) {
            next('/create_new_shop')
            NProgress.done()
          }
          if (!user.data.is_superuser) {
            const userInfo = {
              name: user.data.full_name,
              shopId: user.data.shop_id,
              roles: user.data.is_staff ? ['user'] : ['admin']
            }
            UserModule.SetUserInfo(userInfo)
          } else {
            const userInfo = {
              name: 'superuser',
              shop_id: null,
              roles: ['developer']
            }
            UserModule.SetUserInfo(userInfo)
          }
        }
        if (_.isEmpty(AppModule.db_schema)) {
          await getDbSchema()
        }
        // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
        // await UserModule.GetUserInfo()
        // const roles = ['admin'] // hack, set roles always 'admin' while developing
        // UserModule.SetRoles(roles)
        // Generate accessible routes map based on role
        PermissionModule.GenerateRoutes(UserModule.roles)
        // Dynamically add accessible routes
        router.addRoutes(PermissionModule.dynamicRoutes)
        // Hack: ensure addRoutes is complete
        // Set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
      } catch (err) {
        // Remove token and redirect to login page
        UserModule.ResetToken()
        Message.error(err || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      next()
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
