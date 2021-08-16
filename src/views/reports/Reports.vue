<template>
    <!-- 数据报表 -->
    <el-card class="box-card">
        <div id="graph"></div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import api from '@/http/api'

export default defineComponent({
    setup() {
        onMounted(() => {
            api.intention()
                .then((res: any) => {
                    // console.log(res)
                    let chartDom = document.getElementById('graph') as any
                    let myChart = echarts.init(chartDom) as any
                    myChart.setOption(res.data) as any
                })
                .catch((err: any) => {
                    console.log(err)
                })
        })
        return {
            // option
        }
    }
})
</script>

<style scoped>
#graph {
    width: 100%;
    height: 400px;
}
</style>
