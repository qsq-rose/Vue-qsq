import Cookie from "cookie_js"

export function getToken() {
    return Cookie.get('admin_toKen')
}
export function setToken(token) {
    Cookie.set('admin_toKen', token)
}
export function removeToken() {
    return Cookie.remove('admin_toKen')
}
export function setUsername(value) {
    Cookie.set('username', value)
}
export function removeUsername() {
    return Cookie.remove('username')
}