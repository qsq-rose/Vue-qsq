import { GetCategory, GetCategoryAll } from "@/api/new";
import { reactive } from "@vue/composition-api"
export function common() {
    const category = reactive({
        item: []
    })
    const getInfoCategory = (params) => {
        GetCategory({}).then(res => {
            category.item = res.data.data.data
        })
    }
    /**
     * 获取全部分类
     */
    const getInfoCategoryAll = (params) => {
        GetCategoryAll({}).then(res => {
            category.item = res.data.data.data
        })
    }
    return {
        getInfoCategory,
        getInfoCategoryAll,
        category
    }
}