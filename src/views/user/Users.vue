<template>
    <!-- 用户管理 -->
    <div class="login">
        <el-card class="box-card">
            <div class="head">
                <div class="ipt">
                    <el-input placeholder="请输入内容" v-model="input" clearable></el-input>
                    <div class="icon">
                        <i class="el-icon-search"></i>
                    </div>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
                </div>
            </div>
            <div>
                <Tabulation ref="tabula" :input="input"></Tabulation>
            </div>
        </el-card>
        <el-dialog title="添加用户" v-model="dialogFormVisible">
            <el-form :model="form" :rules="rules">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="abolish">取 消</el-button>
                    <el-button type="primary" @click="add">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, toRefs } from 'vue'
import Tabulation from '../../components/user/Tabulation.vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import api from '@/http/api'
interface obj {
    username: string
    password: string
    email: string
    mobile: string
}

export default defineComponent({
    components: {
        Tabulation
    },
    setup() {
        // //声明
        let input = ref<string>('')
        let dialogFormVisible = ref<boolean>(false)
        let form = ref<obj>({
            username: '',
            password: '',
            email: '',
            mobile: ''
        })
        let formLabelWidth = ref<string>('40px')
        let rules = ref<any>({
            //填入的值就是每一项prop 数组方式 多个验证规则
            username: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '用户名不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 2,
                    // 最大输入
                    max: 6,
                    message: '用户名在2-6位之间',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '密码不能为空',
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
            ],
            email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                {
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: ['blur', 'change']
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
        let tabula = ref<any>(null)
        //
        // //方法
        let add = () => {
            // console.log(form.value)
            api.Addusers({
                username: form.value.username,
                password: form.value.password,
                email: form.value.email,
                mobile: form.value.mobile
            })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.msg == '创建成功') {
                        ElMessage.success({
                            message: '创建成功',
                            type: 'success'
                        })
                        form.value = {
                            username: '',
                            password: '',
                            email: '',
                            mobile: ''
                        }
                        tabula.value.Getusers()
                        dialogFormVisible.value = false
                    } else {
                        ElMessage.error('创建失败')
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        let abolish = () => {
            form.value = {
                username: '',
                password: '',
                email: '',
                mobile: ''
            }
            dialogFormVisible.value = false
        }

        //
        return {
            input,
            form,
            dialogFormVisible,
            formLabelWidth,
            rules,
            add,
            tabula,
            abolish
        }
    }
})
</script>

<style scoped>
.head {
    display: flex;
    margin-bottom: 20px;
}
.ipt {
    display: flex;
    width: 360px;
}
.icon {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    /* border-radius: 4px; */
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0 15px;
    white-space: nowrap;
}
.btn {
    margin-left: 20px;
}
</style>
