<template>
    <div id="box">
        <div class="login">
            <div class="title">
                <div>
                    <h1>欢迎来到小爱后台管理系统</h1>
                </div>
            </div>
            <div id="box1">
                <el-form :model="ruleForm1" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="请输入用户名" prop="username">
                        <el-input v-model="ruleForm1.username"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入密码" prop="password">
                        <el-input type="password" v-model="ruleForm1.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="remind">特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。</div>
            <div class="btn">
                <el-button type="primary" @click="goto">立即登录</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/http/api'
import { useRoute, useRouter } from 'vue-router'

interface obj {
    username: string
    password: string
}

export default defineComponent({
    setup() {
        // 声明
        let router = useRouter()
        let ruleForm1 = ref<obj>({
            username: '',
            password: ''
        })
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
            ]
        })
        let obj = ref<any>([{ authName: '首页', path: '' }])
        //

        // 方法
        let goto = () => {
            api.login({
                username: ruleForm1.value.username,
                password: ruleForm1.value.password
            })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.status == 200) {
                        ElMessage.success({
                            message: '登录成功',
                            type: 'success'
                        })
                        localStorage.setItem(
                            'username',
                            ruleForm1.value.username
                        )
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem(
                            'navigationBar',
                            JSON.stringify(obj.value)
                        )

                        router.push('/')
                    } else {
                        ElMessage.warning({
                            message: '输入有误',
                            type: 'warning'
                        })
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        //

        return {
            ruleForm1,
            rules,
            obj,
            goto
        }
    }
})
</script>

<style scoped>
.btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.remind {
    font-size: 14px;
    text-align: center;
}
#box1 {
    width: 595px;
    margin: 35px 5%;
    opacity: 1;
    filter: alpha(opacity=100);
}
.title {
    padding: 20px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #c0c0c0;
}
.login {
    margin: 100px auto;
    width: 700px;
    border: 1px solid #c0c0c0;
}
#box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
