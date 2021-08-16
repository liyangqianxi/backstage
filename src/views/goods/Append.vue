<template>
    <!-- 添加商品 -->
    <el-card>
        <div class="top">
            <el-alert title="添加商品信息" type="info" center :closable="false"></el-alert>
        </div>
        <div class="top steps">
            <el-steps :active="active" finish-status="success">
                <el-step :title="item" v-for="(item, index) in step" :key="index"></el-step>
            </el-steps>
        </div>
        <div class="flex-sb mat20">
            <div>
                <el-tabs tab-position="left" @tab-click="click" v-model="activeName">
                    <el-tab-pane label="基本信息" name="0" :disabled="!(active >= 0)">
                        <div class="tab">
                            <el-form :model="edit" :rules="rules" ref="submit" class="demo-ruleForm">
                                <el-form-item label="商品名称" prop="goods_name">
                                    <el-input v-model="edit.goods_name"></el-input>
                                </el-form-item>
                                <el-form-item label="商品价格" prop="goods_price">
                                    <el-input v-model="edit.goods_price" :disabled="num === 5"></el-input>
                                </el-form-item>
                                <el-form-item label="商品重量" prop="goods_weight">
                                    <el-input v-model="edit.goods_weight" :disabled="num >= 4"></el-input>
                                </el-form-item>
                                <el-form-item label="商品数量" prop="goods_number">
                                    <el-input v-model="edit.goods_number" :disabled="num >= 3"></el-input>
                                </el-form-item>
                                <el-form-item label="商品分类" label-width="80px" prop="goods_cat">
                                    <el-cascader v-model="edit.goods_cat" :options="options" :props="Props" :disabled="num >= 2"></el-cascader>
                                </el-form-item>
                            </el-form>
                            <div class="next" v-if="num === 0">
                                <el-button type="success" @click="next(1)" size="medium">下一步</el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1" :disabled="!(active >= 1)">
                        <div class="nexttwo">
                            <div v-for="(item, index) in only" :key="index">
                                <div class="guige">{{ item.attr_name }}</div>
                                <span v-for="(item1, index1) in item.attr_vals" :key="Number(index1)">
                                    <el-tag class="tag">{{ item1 }}</el-tag>
                                    <div v-if="!item1">暂无数据</div>
                                </span>
                            </div>
                            <div v-if="only.length === 0">暂无参数</div>
                            <el-button type="success" @click="next(2)" size="small" style="margin-top: 10px">下一步</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2" :disabled="!(active >= 2)">
                        <div class="nexttwo">
                            <div v-for="(item, index) in many" :key="index">
                                <div class="guige">{{ item.attr_name }}</div>
                                <span v-for="(item1, index1) in item.attr_vals" :key="Number(index1)" class="attr_vals">
                                    <el-tag class="tag">{{ item1 }}</el-tag>
                                    <div v-if="!item1">暂无数据</div>
                                </span>
                            </div>
                            <div v-if="only.length === 0">暂无参数</div>
                            <el-button type="success" @click="next(3)" size="small" style="margin-top: 10px">下一步</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3" :disabled="!(active >= 3)">
                        <el-upload class="upload-demo" drag action="/api/upload" :on-success="success" multiple :headers="headers">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或
                                <em>点击上传</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
                            </template>
                        </el-upload>
                        <el-button type="success" @click="next(4)" size="small" style="margin-top: 10px">下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4" :disabled="!(active >= 4)">
                        <div id="div1"></div>
                        <el-button class="butt" type="success" @click="next(5)">提交</el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div></div>
        </div>
    </el-card>
</template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import api from '../../http/api'
import E from 'wangeditor'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
interface Obj1 {
    goods_name: string
    goods_price: string
    goods_weight: string
    goods_number: string
    goods_cat: any //分类
}
interface obj3 {
    value: string
    label: string
    children: any
}
interface Obj {
    attr_id: number
    attr_name: string
    attr_sel: string
    attr_vals: any
}
interface obj {
    tmp_path: string
    url: string
}
export default defineComponent({
    setup() {
        let router = useRouter()
        let token = localStorage.getItem('token')
        let headers = { Authorization: token }
        let flag = ref<boolean>(false)
        let num = ref<number>(0)
        let active = ref<number>(0) //步骤条下标
        let options = ref<Obj1[]>([]) //分类
        let activeName = ref<string>('0')
        let sel = ref<string>('only ') //静态
        let only = ref<Obj[]>([]) //静态参数
        let many = ref<Obj[]>([]) //动态态参数
        let img = ref<obj>() //图片
        let content = ref<string>('') //内容
        let step = ref<string[]>([
            //选择器
            '基本信息',
            '商品参数',
            '商品属性',
            '商品图片',
            '商品内容',
            '完成'
        ])
        let Props = ref<obj3>({
            //选择数据
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
        })
        // 表单验证
        let edit = ref<Obj1>({
            //添加用户
            goods_name: '',
            goods_price: '',
            goods_weight: '',
            goods_number: '',
            goods_cat: '' //分类
        })
        let rules = ref<any>({
            goods_name: [
                { required: true, message: '商品名称不能为空', trigger: 'blur' }
            ],
            goods_price: [
                { required: true, message: '商品价格不能为空', trigger: 'blur' }
            ],
            goods_weight: [
                { required: true, message: '商品重量不能为空', trigger: 'blur' }
            ],
            goods_number: [
                { required: true, message: '商品数量不能为空', trigger: 'blur' }
            ]
        })
        watch(
            () => edit.value,
            (val) => {
                if (!val.goods_name) num.value = 5
                else if (!val.goods_price) num.value = 4
                else if (!val.goods_weight) num.value = 3
                else if (!val.goods_number) num.value = 2
                else if (!val.goods_cat) num.value = 1
                else {
                    num.value = 0
                    flag.value = true
                }
            },
            { deep: true, immediate: true }
        )
        //    点击tab导航栏
        let click = (e: any) => {
            console.log(e)
            active.value = Number(e.index)
        }
        // 表单填写完成下一步
        let next = (num: number) => {
            if (active.value < 4) {
                active.value++
                activeName.value = active.value + ''
            }
            if (num === 1) {
                sel.value = 'only'
                categories() //跳到第二部
                console.log(edit.value)
            } else if (num === 2) {
                //第二部
                sel.value = 'many'
                active.value = 2
                categories()
            } else if (num === 5) {
                addgoods()
            }
        }
        // 添加商品
        let addgoods = () => {
            let attrs = only.value.concat(many.value)
            api.addgoods({
                goods_name: edit.value.goods_name,
                goods_cat: edit.value.goods_cat.join(','),
                goods_price: Number(edit.value.goods_price),
                goods_number: Number(edit.value.goods_number),
                goods_weight: Number(edit.value.goods_weight),
                goods_introduce: content.value,
                pics: img.value,
                attrs: attrs
            })
                .then((res: any) => {
                    console.log(res)
                    if (res.meta.status == 201) {
                        ElMessage.success('创建商品成功')
                        router.push('/goods')
                    } else {
                        ElMessage.warning('创建商品失败请检查')
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        // 获取商品参数静态
        let categories = () => {
            api.categorie({
                id: Number(
                    edit.value.goods_cat[edit.value.goods_cat.length - 1]
                ),
                sel: sel.value
            })
                .then((res: any) => {
                    console.log(res)
                    if (res.data) {
                        res.data.map((item: any) => {
                            if (item.attr_vals) {
                                item.attr_vals = item.attr_vals.split(',')
                            }
                        })
                    }
                    if (sel.value === 'only') {
                        only.value = res.data
                    } else {
                        many.value = res.data
                    }
                })
                .catch((err) => {
                    console.log(err, '获取静态参数失败')
                })
        }
        // 商品分类列表数据
        let getcategories = () => {
            api.getcategories()
                .then((res: any) => {
                    options.value = res.data
                    console.log(options.value)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        // 上传图片成功
        let success = (e: any) => {
            console.log(e)
            img.value = e.data
        }
        onMounted(() => {
            getcategories()
            const editor = new E(document.getElementById('div1'))
            editor.create()
            editor.config.onchange = function (newHtml: any) {
                content.value = newHtml
            }
            console.log(content.value)
        })
        return {
            active,
            edit,
            rules,
            options,
            Props,
            step,
            click,
            flag,
            activeName,
            next,
            only,
            success,
            headers,
            many,
            num
        }
    }
})
</script>
  
  <style scoped>
.top {
    margin-left: 140px;
}
.steps {
    margin-top: 30px;
}
.tab {
    margin-left: 40px;
}
.el-input {
    width: 1360px !important;
}
.next {
    margin-left: 80px;
    margin-top: 10px;
}
.nexttwo {
    margin-left: 20px;
    margin-top: 20px;
}
.tag {
    margin-top: 10px;
    margin-right: 10px;
}
.guige {
    margin-bottom: 10px;
}
#div1 {
    width: 1480px;
}
.butt {
    margin-top: 10px;
}
</style>
