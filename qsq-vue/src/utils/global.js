import { MessageBox } from 'element-ui';
export default {
    install(Vue, options) {
        Vue.prototype.confirm = (params) => {
            MessageBox
                .confirm(params.content, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                })
                .then(() => {
                    console.log('确定');

                    if (params.fn) { params.fn(params.id || '') }
                })
                .catch(() => {
                    console.log('取消');

                    if (params.catchfn) { params.catchfn() }
                });
        }
    }
}
//vue 插件