import router from "./index"
import { getToken, removeToken, removeUsername } from "../utils/app"
import store from "../store/index"
const whiteRouter = ['/login']
//路由守卫
router.beforeEach((to, from, next) => {
    if (getToken()) {
        if (to.path === '/login') {
            removeToken();
            removeUsername();
            store.commit('app/SET_TOKEN', '');
            store.commit('app/SET_USERNAME', '');
            next()
        } else {
            next()
        }
        console.log('已经存在')
    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')//路由指向
        }
        console.log('不存在')

        //直接进入index的时候，参数to被改变成了'/index'，触发路由指向，就会跑beforeEach
        //再一次next指向了login，再次发生路由指向，再跑beforeeach，参数to被改变成立"/login"
        //所以不会再执行beforeach


    }
    //to 下一个页面
    //from 离开之前的页面

})