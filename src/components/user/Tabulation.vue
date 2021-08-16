<template>
    <div>
        <el-table :data="arr" border style="width: 100%">
            <el-table-column align="center" type="index" label="#" width="70"></el-table-column>
            <el-table-column align="center" prop="username" label="姓名" width="100"></el-table-column>
            <el-table-column align="center" prop="role_name" label="角色" width="150"></el-table-column>
            <el-table-column align="center" prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column align="center" label="状态" width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#dcdfe6" @change="recompose(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="cancel(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="allot(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
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
        <!-- 弹出框 -->
        <!-- 修 -->
        <el-dialog title="编辑用户" v-model="show1">
            <el-form :model="form" :rules="rules">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
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
        <!-- 分配 -->
        <el-dialog title="分配用户" v-model="show3" width="30%">
            <div style="margin-bottom: 10px;">当前用户:{{form.username}}</div>
            <div style="margin-bottom: 10px;">当前角色:{{form.role_name}}</div>
            <el-select v-model="region" placeholder="请选择">
                <el-option v-for="item in angle" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="show3=false">取 消</el-button>
                    <el-button type="primary" @click="allocation">确 定</el-button>
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
    create_time: number
    email: string
    id: number
    mg_state: boolean
    mobile: string
    role_name: string
    username: string
}

export default defineComponent({
    props: {
        input: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        // //声明
        // 用户数据列表
        let query = ref<string>('')
        let pagenum = ref<number>(1)
        let pagesize = ref<number>(5)

        let arr = ref<obj[]>([])
        let total = ref<number>(0)

        //修改删除设置显示框
        let show1 = ref<boolean>(false)
        let show2 = ref<boolean>(false)
        let show3 = ref<boolean>(false)

        let form = ref<any>({})
        let region = ref<string>('')
        let rules = ref<any>({
            //填入的值就是每一项prop 数组方式 多个验证规则\
            email: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '邮箱不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 6,
                    // 最大输入
                    max: 20,
                    message: '用户名在6-20位之间',
                    trigger: 'blur'
                }
            ],
            mobile: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '电话不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 6,
                    // 最大输入
                    max: 15,
                    message: '用户名在6-15位之间',
                    trigger: 'blur'
                }
            ]
        })

        let id = ref<number>(0)
        // 角色
        let angle = ref<any>([])
        //

        // 方法
        let Getusers = () => {
            api.Getusers({
                query: props.input,
                pagenum: pagenum.value,
                pagesize: pagesize.value
            })
                .then((res: any) => {
                    // console.log(res)
                    arr.value = res.data.users
                    total.value = res.data.total
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 修改状态
        let recompose = (row: any) => {
            // console.log(row.mg_state)
            api.Amend({ uId: row.id, type: row.mg_state })
                .then((res: any) => {
                    // console.log(res)
                    ElMessage.success({
                        message: res.meta.msg,
                        type: 'success'
                    })
                    Getusers()
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 编
        let edit = (row: any) => {
            // console.log(row)
            show1.value = true
            form.value = row
            // console.log(form.value, '111')
        }
        let compile = () => {
            api.RedactUser({
                id: form.value.id,
                email: form.value.email,
                mobile: form.value.mobile
            })
                .then((res: any) => {
                    // console.log(res)
                    ElMessage.success({
                        message: res.meta.msg,
                        type: 'success'
                    })
                    show1.value = false
                    Getusers()
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        //// 删
        let cancel = (row: number) => {
            show2.value = true
            // console.log(row)
            id.value = row
        }
        // 取消删
        let abrogate = () => {
            show2.value = false
            ElMessage('取消了删除')
        }
        // 确认删
        let affirm = () => {
            api.Expurgate({ id: id.value })
                .then((res: any) => {
                    if (res.meta.status === 200) {
                        ElMessage.success({
                            message: res.meta.msg,
                            type: 'success'
                        })
                        Getusers()
                    } else {
                        ElMessage.error(res.meta.msg)
                    }
                    // console.log(res)
                    show2.value = false
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 设置
        let allot = (row: any) => {
            // console.log(row, '11')
            show3.value = true
            form.value = row
            id.value = row.id
            // console.log(id.value)
        }
        let allocation = () => {
            // console.log(region.value)
            api.Allocation({ id: id.value, rid: region.value })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.status === 200) {
                        ElMessage.success({
                            message: res.meta.msg,
                            type: 'success'
                        })
                        Getusers()
                    } else {
                        ElMessage.error(res.meta.msg)
                    }
                    show3.value = false
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }

        const handleSizeChange = (val: any) => {
            pagesize.value = val
            Getusers()
        }
        const handleCurrentChange = (val: any) => {
            pagenum.value = val
            Getusers()
        }
        // 角色列表
        let Getrole = () => {
            api.Getrole()
                .then((res: any) => {
                    // console.log(res)
                    angle.value = res.data
                    // console.log(angle.value)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        onMounted(() => {
            Getusers()
            Getrole()
        })
        watch(
            () => props.input,
            () => {
                Getusers()
            }
        )

        return {
            query,
            pagenum,
            pagesize,
            arr,
            total,
            show1,
            show2,
            show3,
            form,
            region,
            rules,
            id,
            angle,
            Getusers,
            handleSizeChange,
            handleCurrentChange,
            recompose,
            edit,
            Getrole,
            compile,
            cancel,
            abrogate,
            affirm,
            allot,
            allocation
        }
    }
})
</script>

<style scoped>
.Pagination {
    margin: 10px 0;
}
</style>
