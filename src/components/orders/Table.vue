<template>
    <div>
        <div class="ipt">
            <el-input placeholder="请输入内容" v-model="input" clearable></el-input>
            <div class="icon">
                <i class="el-icon-search"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        let input = ref<string>('')
        return {
            input
        }
    }
})
</script>

<style scoped>
.ipt {
    display: flex;
    width: 360px;
    margin-bottom: 20px;
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
</style>
