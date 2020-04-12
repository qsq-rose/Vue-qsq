import Vue from "vue";
import VueRouter from "vue-router";



Vue.use(VueRouter);
//引入布局组件

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: '主页'
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("../views/Login/index.vue"),
    meta: {
      name: '登录'
    }
  },
  {
    path: "/console",
    name: "Console",
    redirect: 'index',
    component: () => import("../views/Layout/index.vue"),
    meta: {
      name: '控制台',
      icon: 'el-icon-s-platform'
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          name: '首页'
        },
        component: () => import("../views/Console/index.vue"),
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    component: () => import("../views/Layout/index.vue"),
    meta: {
      name: '信息管理',
      icon: 'el-icon-s-comment'
    },
    children: [
      {
        path: '/infoIndex',
        name: 'InfoIndex',
        meta: {
          name: '信息列表'
        },
        component: () => import("../views/Info/index.vue")
      },
      {
        path: '/indexCategory',
        name: 'IndexCategory',
        meta: {
          name: '信息分类'
        },
        component: () => import("../views/Info/category.vue")
      }
    ]
  },
  //用户界面
  {
    path: "/user",
    name: "User",
    redirect: 'index',
    component: () => import("../views/Layout/index.vue"),
    meta: {
      name: '用户管理',
      icon: 'el-icon-s-custom'
    },
    children: [
      {
        path: '/userCategory',
        name: 'UserCategory',
        meta: {
          name: '用户列表'
        },
        component: () => import("../views/User/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
