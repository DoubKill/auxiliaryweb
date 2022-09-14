import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes 路由配在这里
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/redirect',
  component: () => import('@/views/redirectIndex'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: {
    icon: 'dashboard'
  },
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard'
    }
  }]
}
]

// 存在权限的路由
// meta.roles  权限
export const asyncRoutes = [{
  path: '/recipe',
  component: Layout,
  redirect: '/recipe/list',
  name: 'Recipe',
  meta: {
    title: '配方管理',
    icon: 'formula',
    permissionName: 'recipe'
  },
  children: [{
    path: 'list',
    component: () => import('@/views/recipe/list/index'),
    name: 'RecipeList',
    meta: {
      title: '配方列表',
      permissionName: 'productbatching'
    }
  },
  {
    path: 'recipe_display',
    component: () => import('@/views/recipe/list/recipe_display'),
    name: 'RecipeDisplay',
    meta: {
      title: '配方详情',
      navHidden: true,
      permissionName: 'productbatching',
      activeMenu: '/recipe/list'
    }
  },
  {
    path: 'create',
    component: () => import('@/views/recipe/list/recipe_create'),
    name: 'RecipeCreate',
    meta: {
      title: '新增配方',
      navHidden: true,
      permissionName: 'productbatching',
      activeMenu: '/recipe/list'
    }
  },
  {
    path: 'modify/:id',
    component: () => import('@/views/recipe/list/recipe_modify'),
    name: 'RecipeModify',
    meta: {
      title: '修改配方',
      navHidden: true,
      permissionName: 'productbatching',
      activeMenu: '/recipe/list'
    }
  },
  {
    path: 'Copy',
    component: () => import('@/views/recipe/list/recipe_copy'),
    name: 'RecipeCopy',
    meta: {
      title: '复制新增配方',
      navHidden: true,
      permissionName: 'productbatching',
      activeMenu: '/recipe/list'
    }
  },
  {
    path: '/rb/formula-resume',
    name: 'FormulaResume',
    component: () => import('@/views/recipe/formula-resume'),
    meta: {
      title: '配方变更履历',
      permissionName: 'productbatching'
    }
  }
  ]
},
{
  path: '/plan',
  component: Layout,
  alwaysShow: true,
  redirect: '/plan/manage',
  name: 'Plan',
  meta: {
    title: '计划管理',
    icon: 'productionPlanManagement',
    permissionName: 'plan'
  },
  children: [{
    path: 'manage',
    name: 'PlanManage',
    component: () => import('@/views/plan/index'),
    meta: {
      title: '计划列表',
      permissionName: 'productclassesplan'
    }
  }]
},
{
  path: '/material',
  component: Layout,
  alwaysShow: true,
  redirect: '/material/base-info',
  name: 'Material',
  meta: {
    title: '原材料及称量参数',
    icon: 'rawMaterials',
    permissionName: 'production'
  },
  children: [{
    path: 'base-info',
    component: () => import('@/views/material/base-info/index'),
    name: 'MaterialBaseInfo',
    meta: {
      title: '原材料基本信息',
      permissionName: 'material'
    }
  },
  {
    path: 'weighing-info',
    component: () => import('@/views/material/weighing-info/index'),
    name: 'MaterialWeighingInfo',
    meta: {
      title: '称量参数',
      permissionName: 'materialtankstatus'
    }
  },
  {
    path: 'bin-material-setting',
    component: () => import('@/views/material/bin-material-setting/index'),
    name: 'BinMaterialSetting',
    meta: {
      title: '日料罐物料设定',
      permissionName: 'materialtankstatus'
    }
  }
  ]
},
// {
//   path: '/run-mode',
//   component: Layout,
//   redirect: '/run-mode/index',
//   meta: {
//     title: '运行模式切换',
//     icon: 'operationMode',
//     permissionName: 'system'
//   },
//   children: [{
//     path: 'index',
//     name: 'RunMode',
//     component: () => import('@/views/run-mode/index'),
//     meta: {
//       title: '运行模式切换',
//       icon: 'operationMode',
//       permissionName: 'childsysteminfo'
//     }
//   }]
// },
{
  path: '/report',
  component: Layout,
  alwaysShow: true,
  redirect: '/report/material-statistics',
  name: 'Report',
  meta: {
    title: '报表',
    icon: 'report',
    permissionName: 'production'
  },
  children: [{
    path: 'material-statistics',
    component: () => import('@/views/report/material-statistics/index'),
    name: 'MaterialStatisticsReport',
    meta: {
      title: '物料统计报表',
      permissionName: 'expendmaterial'
    }
  },
  {
    path: 'batch-statistics',
    component: () => import('@/views/report/batch/index'),
    name: 'batchStatisticsReport',
    meta: {
      title: '批次记录报表',
      permissionName: 'palletfeedbacks'
    }
  },
  {
    path: 'train-statistics',
    component: () => import('@/views/report/train/index'),
    name: 'trainStatisticsReport',
    meta: {
      title: '车次报表',
      permissionName: 'trainsfeedbacks'
    }
  }
  ]
},
{
  path: '/user-info',
  component: Layout,
  redirect: '/user-info/index',
  meta: {
    title: '用户信息',
    icon: 'userManagement',
    permissionName: 'system'
  },
  children: [{
    path: 'index',
    name: 'userInfo',
    component: () => import('@/views/userInfo/index'),
    meta: {
      title: '用户管理',
      permissionName: 'user'
    }
  },
  {
    path: 'roles-manage',
    name: 'rolesManage',
    component: () => import('@/views/roles-manage/index'),
    meta: {
      title: '角色管理',
      permissionName: 'groupextension'
    }
  }
  ]
},
{
  path: '/system',
  component: Layout,
  redirect: '/system/operations',
  meta: {
    title: '系统管理',
    icon: 'el-icon-notebook-2',
    permissionName: 'system'
  },
  children: [{
    path: 'operations',
    name: 'Operations',
    component: () => import('@/views/operations/index'),
    meta: {
      title: '操作履历',
      icon: 'el-icon-notebook-2'
      // permissionName: 'childsysteminfo'
    }
  },
  {
    path: 'index',
    name: 'RunMode',
    component: () => import('@/views/run-mode/index'),
    meta: {
      title: '运行模式切换',
      icon: 'operationMode',
      permissionName: 'childsysteminfo'
    }
  }
  ]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
