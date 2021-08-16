<template>
    <div class="headerNav">
        <div>欢迎来到小爱后台系统</div>
        <div class="heightBox">
            <div>
                <span class="time">{{dataTime}}</span>
                <span class="time">亲爱的,{{name}}</span>
                <span class="exit" @click="quit">退出</span>
            </div>
            <div></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        // 声明
        let route = useRoute()
        let router = useRouter()
        let name = localStorage.getItem('username')
        let dataTime = ref<string>('')
        // 方法

        // 退出
        let quit = () => {
            clearInterval(tiemr)
            localStorage.removeItem('username')
            ElMessage.success({
                message: '欢迎下次光临',
                type: 'success'
            })
            router.push('/login')
        }
        // 时间
        let tiemr = setInterval(() => {
            dataTime.value =
                new Date().toLocaleString() + ' '.charAt(new Date().getDay())
        }, 1000)
        return {
            name,
            dataTime,
            tiemr,
            quit
        }
    }
})
</script>

<style scoped>
.exit {
    color: #409eff;
    cursor: pointer;
}
.time {
    margin-right: 20px;
}
.headerNav {
    width: 90%;
    font-size: 16px;
    color: #2e5e85;
    border-bottom: 1px solid #f0f2f5;
    padding: 20px 70px;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: #fff;
}
</style>
