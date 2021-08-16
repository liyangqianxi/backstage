<template>
    <!-- 订单列表 -->
    <el-card class="box-card">
        <Table></Table>
        <el-table :data="arr" border style="width: 100%">
            <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
            <el-table-column align="center" prop="order_number" label="订单编号" width="220"></el-table-column>
            <el-table-column align="center" prop="order_price" label="价格" width="80"></el-table-column>
            <el-table-column align="center" label="是否付款" width="80">
                <template #default="scope">
                    <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
                    <el-tag v-else type="success">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="is_send" label="是否发货" width="80"></el-table-column>
            <el-table-column align="center" prop="create_time" label="下单时间" width="180"></el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-location-outline" size="mini" @click="look(scope.row)"></el-button>
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
        <!-- 修改 -->
        <el-dialog title="编辑地址" v-model="show1" width="30%" @close="close">
            <el-cascader v-model="value" :options="citys" @change="handleChange"></el-cascader>
        </el-dialog>
        <!-- 物流状态 -->
        <el-dialog title="物流信息" v-model="show2" width="50%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in stepList" :key="Number(index)" :timestamp="activity.time">{{activity.context}}</el-timeline-item>
            </el-timeline>
        </el-dialog>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '@/http/api'
import Table from '../../components/orders/Table.vue'
import dayjs from 'dayjs'
import city from '../../city/city'
import axios from 'axios'

export default defineComponent({
    components: {
        Table
    },
    setup() {
        //
        // 订单数据列表
        let citys = city
        let query = ref<string>('')
        let pagenum = ref<number>(1)
        let pagesize = ref<number>(5)
        let arr = ref<any[]>([])
        let value = ref<any>('')
        let total = ref<number>(0)

        //修改删除设置显示框
        let show1 = ref<boolean>(false)
        let show2 = ref<boolean>(false)
        // 物流
        let stepList = ref<any>([])
        let num = ref<number>(0)

        //
        // 订单数据列表
        let Getindent = () => {
            api.Getindent({
                query: query.value,
                pagenum: pagenum.value,
                pagesize: pagesize.value
            })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.status === 200) {
                        res.data.goods.map((item: any) => {
                            item.create_time = dayjs(item.create_time).format(
                                `YYYY-MM-DD HH:mm:ss`
                            )
                        })
                        // console.log(res.data.goods)

                        arr.value = res.data.goods
                        total.value = res.data.total
                        // console.log(arr.value)
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 编辑地址
        let edit = (val: any) => {
            show1.value = true
            // console.log(val)
        }
        const handleChange = (value: any) => {
            console.log(value)
        }
        // 查看订单
        let look = (val: any) => {
            // console.log(val, '22')
            let token = localStorage.getItem('token')
            let id = ref(1106975712662)
            axios
                .get(
                    `https://www.liulongbin.top:8888/api/private/v1/kuaidi/${id.value}`,
                    {
                        headers: { Authorization: token }
                    }
                )
                .then((res: any) => {
                    if (res.status === 200) {
                        stepList.value = res.data.data
                        // num.value = stepList.value.length
                        // console.log(stepList.value)
                    }
                })
                .catch(() => {
                    console.log('物流请求失败')
                })
            show2.value = true
        }
        let close = () => {
            value.value = []
        }
        const handleSizeChange = (val: any) => {
            pagesize.value = val
            Getindent()
        }
        const handleCurrentChange = (val: any) => {
            pagenum.value = val
            Getindent()
        }
        onMounted(() => {
            Getindent()
        })
        return {
            pagenum,
            pagesize,
            arr,
            show1,
            show2,
            value,
            citys,
            stepList,
            num,
            total,
            edit,
            handleChange,
            look,
            handleSizeChange,
            handleCurrentChange,
            close
        }
    }
})
</script>

<style scoped>
</style>
