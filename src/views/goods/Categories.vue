<template>
    <!-- 商品分类 -->
    <el-card class="box-card">
        <div class="btn">
            <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </div>
        <div class="commodity">
            <el-table :data="arr" border style="width: 100%">
                <el-table-column align="center" type="index" label="#" width="70"></el-table-column>
                <el-table-column type="expand">
                    <!-- 二级 -->
                    <template #default="props">
                        <el-table :data="props.row.children" border :show-header="false" style="width: 100%">
                            <el-table-column align="center" label="#" width="70"></el-table-column>
                            <el-table-column type="expand">
                                <!-- 三级 -->
                                <template #default="props">
                                    <el-table :data="props.row.children" :show-header="false" border style="width: 100%">
                                        <el-table-column align="center" label="#" width="70"></el-table-column>
                                        <el-table-column type="expand">
                                            <template #default="props">
                                                <el-table :data="props.row.children" border :show-header="false" style="width: 100%">
                                                    <el-table-column align="center" label="#" width="70"></el-table-column>
                                                    <el-table-column type="expand">
                                                        <!-- <template #default="props"></template> -->
                                                    </el-table-column>

                                                    <el-table-column align="center" label="分类名称" prop="cat_name" width="180"></el-table-column>
                                                    <el-table-column align="center" label="是否有效" width="180">
                                                        <template #default="scope">
                                                            <i v-if="scope.row.cat_deleted==false" class="el-icon-success"></i>
                                                            <i v-else class="el-icon-error"></i>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="排序" align="center" width="200">
                                                        <el-tag type="warning">三级</el-tag>
                                                    </el-table-column>
                                                    <el-table-column label="操作" align="center">
                                                        <template #default="scope">
                                                            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                                                            <el-button type="danger" icon="el-icon-delete" @click="cancel(scope.row)">删除</el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </template>
                                        </el-table-column>

                                        <el-table-column align="center" label="分类名称" prop="cat_name" width="180"></el-table-column>
                                        <el-table-column align="center" label="是否有效" width="180">
                                            <template #default="scope">
                                                <i v-if="scope.row.cat_deleted==false" class="el-icon-success"></i>
                                                <i v-else class="el-icon-error"></i>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="排序" align="center" width="200">
                                            <el-tag type="warning">三级</el-tag>
                                        </el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template #default="scope">
                                                <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                                                <el-button type="danger" icon="el-icon-delete" @click="cancel(scope.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="分类名称" prop="cat_name" width="180"></el-table-column>
                            <el-table-column align="center" label="是否有效" width="180">
                                <template #default="scope">
                                    <i v-if="scope.row.cat_deleted==false" class="el-icon-success"></i>
                                    <i v-else class="el-icon-error"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="排序" align="center" width="200">
                                <el-tag type="success">二级</el-tag>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template #default="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="cancel(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="分类名称" prop="cat_name" width="180"></el-table-column>
                <el-table-column align="center" label="是否有效" width="180">
                    <template #default="scope">
                        <i v-if="scope.row.cat_deleted==false" class="el-icon-success"></i>
                        <i v-else class="el-icon-error"></i>
                    </template>
                </el-table-column>
                <el-table-column label="排序" align="center" width="200">
                    <el-tag>一级</el-tag>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="cancel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="Pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[5, 15, 20, 30]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </el-card>

    <!-- 修 -->
    <el-dialog title="编辑分类" v-model="show1" width="40%">
        <el-form :rules="rules" :model="form">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="show1 = false">取 消</el-button>
                <el-button type="primary" @click="compile">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 删 -->
    <el-dialog title="提示" v-model="show2" width="30%">
        <span style="display: flex;">
            <div>
                <i class="el-icon-warning"></i>
            </div>
            <div style="line-height: 25px ; margin-left: 10px;">此操作将永久删除该角色, 是否继续?</div>
        </span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="abrogate">取 消</el-button>
                <el-button type="primary" @click="affirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 添加用户 -->
    <div class="addition">
        <el-dialog title="添加用户" v-model="dialogFormVisible" width="33%" @close="close">
            <el-form :model="form" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="cascader">
                <div class="title">父级分类</div>
                <el-cascader v-model="value" :disabled="show3" :props="Props" :options="arr1" @change="handleChange"></el-cascader>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible=false">取 消</el-button>
                    <el-button type="primary" @click="add">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import api from '@/http/api'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
interface obj {
    cat_deleted: boolean
    cat_id: number
    cat_level: number
    cat_name: string
    cat_pid: number
}
interface cat {
    cat_name: string
    username: string
}
interface obj1 {
    value: string
    label: string
    children: any
    checkStrictly: boolean
}

export default defineComponent({
    setup() {
        //
        // 商品分类数据列表
        let pagenum = ref<number>(1)
        let pagesize = ref<number>(5)
        let arr = ref<obj[]>([])
        let arr1 = ref<obj[]>([])

        // 添加用户
        let dialogFormVisible = ref<boolean>(false)
        //修改删除设置显示框
        let show1 = ref<boolean>(false)
        let show2 = ref<boolean>(false)

        //  添加用户Cascader 级联选择器
        let show3 = ref<boolean>(true)
        // 分类 ID
        let id = ref<number>(0)
        // 分类名称
        let form = ref<cat>({
            cat_name: '',
            username: ''
        })
        let Props = ref<obj1>({
            //选择数据
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            checkStrictly: true
        })

        let rules = ref<any>({
            //填入的值就是每一项prop 数组方式 多个验证规则\
            cat_name: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '分类名称不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 2,
                    // 最大输入
                    max: 10,
                    message: '分类名称在2-10位之间',
                    trigger: 'blur'
                }
            ],
            username: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '分类名称不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 2,
                    // 最大输入
                    max: 10,
                    message: '分类名称在2-10位之间',
                    trigger: 'blur'
                }
            ]
        })
        // 条数
        let total = ref<number>(0)
        let value = ref<any>('')
        let cat_level = ref<number>(0)

        //

        //
        // 商品分类数据列表
        let categories = () => {
            api.categories({
                type: 0,
                pagenum: pagenum.value,
                pagesize: pagesize.value
            })
                .then((res: any) => {
                    // console.log(res)
                    arr.value = res.data.result
                    localStorage.setItem(
                        'classification',
                        JSON.stringify(arr.value)
                    )
                    total.value = res.data.total
                    let arr2 = JSON.stringify(res.data.result) as any

                    arr1.value = JSON.parse(arr2)

                    arr1.value.map((item: any) => {
                        if (item.children) {
                            item.children.map((item1: any) => {
                                item1.children = undefined
                            })
                        }
                    })
                    // console.log(arr1.value)

                    // console.log(arr.value)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 编
        let edit = (val: any) => {
            show1.value = true
            form.value.cat_name = val.cat_name
            id.value = val.cat_id
            // console.log(id.value)
        }
        let compile = () => {
            api.edit({ id: id.value, cat_name: form.value.cat_name })
                .then((res: any) => {
                    // console.log(res)
                    ElMessage.success({
                        message: res.meta.msg,
                        type: 'success'
                    })
                    show1.value = false
                    categories()
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 删
        let cancel = (val: any) => {
            // console.log(val)
            show2.value = true
            id.value = val.cat_id
        }
        // 取消删
        let abrogate = () => {
            show2.value = false
            ElMessage('取消了删除')
        }
        // 确认删
        let affirm = () => {
            api.delete({ id: id.value })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.status === 200) {
                        ElMessage.success({
                            message: res.meta.msg,
                            type: 'success'
                        })
                        categories()
                    } else {
                        ElMessage.error(res.meta.msg)
                    }
                    show2.value = false
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 添加用户
        let add = () => {
            api.addition({
                cat_pid: id.value,
                cat_name: form.value.username,
                cat_level: cat_level.value
            })
                .then((res: any) => {
                    console.log(res)
                    form.value.username = ''
                    value.value = []
                    dialogFormVisible.value = false
                    categories()
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        let close = () => {
            form.value.username = ''
            value.value = []
        }
        const handleSizeChange = (val: any) => {
            pagesize.value = val
            categories()
        }
        const handleCurrentChange = (val: any) => {
            pagenum.value = val
            categories()
        }
        const handleChange = (value: any) => {
            // console.log(value, 'value')
            if (value.length > 0) {
                id.value = value[value.length - 1]
            }
            cat_level.value = value.length
        }

        onMounted(() => {
            categories()
        })
        watch(
            () => form.value.username,
            (val) => {
                if (val) {
                    show3.value = false
                }
            }
        )

        return {
            pagenum,
            pagesize,
            arr,
            arr1,
            dialogFormVisible,
            show1,
            show2,
            show3,
            id,
            form,
            rules,
            total,
            value,
            Props,
            cat_level,
            edit,
            cancel,
            compile,
            abrogate,
            affirm,
            handleSizeChange,
            handleCurrentChange,
            add,
            handleChange,
            close
        }
    }
})
</script>

<style scoped>
.btn {
    margin-bottom: 20px;
}
.cascader {
    display: flex;
    font-size: 13px;
    line-height: 40px;
}

.title {
    margin-right: 13px;
}
</style>
