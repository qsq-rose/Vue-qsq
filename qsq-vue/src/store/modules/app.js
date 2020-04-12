import { Login } from "@/api/login";
import { setToken, setUsername, getUsername, removeToken, removeUsername } from "@/utils/app"
import Cookie from "cookie_js"
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    token: '',
    username: Cookie.get('username') || ''
}
const getters = {
    isCollapse: state => state.isCollapse,
    username: state => state.username
}
const mutations = {
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
        //sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
    },
    SET_TOKEN(state, value) {
        state.token = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    }
}
const actions = {
    login(content, data) {
        return new Promise((resolve, reject) => {

            //接口
            Login(data).then((res) => {
                let data = res.data.data;
                content.commit('SET_TOKEN', data.token);
                content.commit('SET_USERNAME', data.username);
                setToken(data.token)
                setUsername(data.username)
                resolve(res)
                //存储token，username
            }).catch((err) => {
                reject(err)
            })
        })
    },
    exit({ commit }) {
        return new Promise((resolve, reject) => {

            removeToken();
            removeUsername();
            commit('SET_TOKEN', '');
            commit('SET_USERNAME', '')
            resolve()
        })
    }
}


export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};