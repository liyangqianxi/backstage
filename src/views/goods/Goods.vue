<template>
    <!-- 商品列表 -->
    <el-card class="box-card">
        <Head @good="good"></Head>
        <el-table :data="arr" style="width: 100%">
            <el-table-column align="center" type="index" label="#" width="70"></el-table-column>
            <el-table-column align="center" prop="goods_name" label="商品名称" width="250"></el-table-column>
            <el-table-column align="center" prop="goods_price" label="商品价格（元）" width="150"></el-table-column>
            <el-table-column align="center" prop="goods_weight" label="商品重量" width="180"></el-table-column>
            <el-table-column align="center" prop="add_time" label="创建时间" width="180"></el-table-column>
            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="cancel(scope.row.goods_id)"></el-button>
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
    </el-card>
    <!-- 修 -->
    <el-dialog title="编辑用户" v-model="show1">
        <el-form :model="form" :rules="rules">
            <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="form.goods_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="form.goods_price" autocomplete="off" type="number" min="1"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="form.goods_number" autocomplete="off" type="number" min="1"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="form.goods_weight" autocomplete="off" type="number" min="1"></el-input>
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Head from '../../components/goods/Head.vue'
import dayjs from 'dayjs'
import api from '@/http/api'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'

export default defineComponent({
    components: {
        Head
    },
    setup() {
        //
        // 商品列表数据
        let query = ref<string>('')
        let pagenum = ref<number>(1)
        let pagesize = ref<number>(5)

        let total = ref<number>(0)

        let arr = ref<any[]>([])

        let show1 = ref<boolean>(false)
        let show2 = ref<boolean>(false)

        let form = ref<any>({})

        let id = ref<number>(0)
        //

        //
        let good = (e: any) => {
            // console.log(e)
            query.value = e
            goods()
        }
        // 商品列表数据
        let goods = () => {
            api.goods({
                query: query.value,
                pagenum: pagenum.value,
                pagesize: pagesize.value
            })
                .then((res: any) => {
                    // console.log(res)
                    if (res.meta.status == 200) {
                        res.data.goods.map((item: any) => {
                            item.add_time = dayjs(item.add_time).format(
                                `YYYY-MM-DD HH:mm:ss`
                            )
                        })
                        arr.value = res.data.goods
                        total.value = res.data.total
                    }
                })
                .catch((err: any) => {
                    console.log(err)
                })
        }
        // 编
        let edit = (row: any) => {
            form.value = row
            show1.value = true
            // console.log(form.value)
            // row = form.value
        }
        let compile = () => {
            ElMessage.success({
                message: '编辑成功',
                type: 'success'
            })
            show1.value = false
        }
        // 删
        let cancel = (row: number) => {
            // console.log(row)
            id.value = row
            show2.value = true
        }
        // 取消删
        let abrogate = () => {
            show2.value = false
            ElMessage('取消了删除')
        }
        // 确认删
        let affirm = () => {
            api.omit({ id: id.value })
                .then((res: any) => {
                    if (res.meta.status === 200) {
                        ElMessage.success({
                            message: res.meta.msg,
                            type: 'success'
                        })
                        goods()
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
        const handleSizeChange = (val: any) => {
            pagesize.value = val
            goods()
        }
        const handleCurrentChange = (val: any) => {
            pagenum.value = val
            goods()
        }
        //
        onMounted(() => {
            goods()
        })
        let rules = ref<any>({
            //填入的值就是每一项prop 数组方式 多个验证规则\
            goods_name: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '商品名称不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                }
            ],
            goods_price: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '商品价格不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 1,
                    message: '商品价格最小输入1',
                    trigger: 'blur'
                }
            ],
            goods_number: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '商品价格不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 1,
                    message: '商品价格最小输入1',
                    trigger: 'blur'
                }
            ],
            goods_weight: [
                {
                    // 是否是必填项
                    required: true,
                    //错误提示
                    message: '商品价格不能为空',
                    // 触发方式 blur change
                    trigger: 'blur'
                },
                {
                    // 限制输入字符
                    // 最小输入
                    min: 1,
                    message: '商品价格最小输入1',
                    trigger: 'blur'
                }
            ]
        })

        return {
            arr,
            pagesize,
            pagenum,
            total,
            show1,
            show2,
            rules,
            form,
            edit,
            cancel,
            handleSizeChange,
            handleCurrentChange,
            compile,
            abrogate,
            affirm,
            goods,
            good
        }
    }
})
</script>

<style scoped>
.Pagination {
    margin: 10px 0;
}
</style>
