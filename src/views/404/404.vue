<template>
    <div id="fault">
        <div id="box">
            <div>
                <i class="iconfont icon-tishi"></i>嗯… 无法访问此页面
            </div>
            <div>检查是否存在拼写错误。</div>
            <div>如果拼写正确，请尝试运行 Windows 网络诊断。</div>
            <div>
                <el-button type="primary" @click="get">返回主页</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        // 变量
        let router = useRouter()
        // 方法
        let get = () => {
            let name = localStorage.getItem('name')
            if (name != null) {
                router.push('/')
            } else {
                router.push('/about')
            }
        }
        return {
            get
        }
    }
})
</script>

<style scoped>
#fault {
    width: 100%;
    height: 760px;
    background: rgb(45, 45, 45);
    position: relative;
}
#box {
    width: 710px;
    height: 400px;
    color: white;
    font-size: 30px;
    position: absolute;
    top: 200px;
    left: 30%;
}

#box div {
    margin: 20rpx;
}

.iconfont {
    font-size: 60px;
    margin-right: 30px;
}
</style>
