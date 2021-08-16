<template>
    <div>
        <div class="head">
            <div class="ipt">
                <el-input placeholder="请输入内容" v-model="input" clearable></el-input>
                <div class="icon" @click="find">
                    <i class="el-icon-search"></i>
                </div>
            </div>
            <div class="btn" @click="goto">
                <el-button type="primary">添加用户</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    emits: ['good'],
    setup(props, ctx) {
        let head = ref<any>([{ authName: '添加商品', path: 'append' }])
        let user = ref<any>([])

        let input = ref<string>('')
        let route = useRoute()
        let router = useRouter()

        //
        let find = () => {
            //
            ctx.emit('good', input.value)
        }
        let goto = () => {
            let arr = JSON.parse(localStorage.getItem('navigationBar')!)
            let item = null
            item = arr.find((i: any) => {
                return i.authName === head.value[0].authName
            })
            if (!item) {
                arr.push(head.value[0])
                localStorage.setItem('navigationBar', JSON.stringify(arr))
            }
            router.push('/append')
        }
        return {
            input,
            find,
            goto
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
