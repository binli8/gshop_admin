// 定义三级分类对象接口的类型
export interface CategoryModel {
    id?: number
    name: string
    categoryId?: number      //所属的分类id
    hasChildren?: boolean    //当前的分类中是否还有其他的子级分类
}

// 定义三级分类对象数组的接口类型
export type CategoryListModel = CategoryModel[]