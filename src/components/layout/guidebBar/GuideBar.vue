<template>
    <!-- 侧边导航栏 -->
    <el-menu :default-active="route.meta.index" class="el-menu-vertical-demo" router :unique-opened="true">
        <el-menu-item index="/" @click="increase">
            <i class="el-icon-s-home"></i>
            <template #title>首页</template>
        </el-menu-item>
        <el-submenu :index="item.path" v-for="(item,index) in arr" :key="index">
            <template #title>
                <i :class="icon[index].icon1"></i>
                <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group v-for="(item1,index1) in item.children" :key="index1">
                <el-menu-item :index="'/'+item1.path" @click="add(item1)">
                    <i :class="icon[index].icon2[index1]"></i>
                    <span>{{item1.authName}}</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Edit } from '@element-plus/icons'
import api from '@/http/api'
interface children {
    authName: string
    id: number
    path: string
}
interface obj {
    authName: string
    children: children[]
    id: number
    path: string
}
interface obj1 {
    icon1: string
    icon2: string[]
}

export default defineComponent({
    setup() {
        // 声明
        let home = ref<any>([{ authName: '首页', path: '' }])
        let route = useRoute()
        let router = useRouter()
        let arr = ref<obj[]>([])
        let icon = ref<obj1[]>([
            { icon1: 'el-icon-user', icon2: ['el-icon-folder-opened'] },
            {
                icon1: 'el-icon-folder',
                icon2: ['el-icon-setting', 'el-icon-c-scale-to-original']
            },
            {
                icon1: 'el-icon-goods',
                icon2: ['el-icon-help', 'el-icon-bell', 'el-icon-date']
            },
            {
                icon1: 'el-icon-s-order',
                icon2: ['el-icon-folder-add']
            },
            {
                icon1: 'el-icon-message',
                icon2: ['el-icon-position']
            }
        ])
        // 侧边导航栏
        let user = ref<any>([])
        let obj = ref<obj[]>([])
        let obj1 = ref<any>({})

        //

        // 方法
        let add = (item1: any) => {
            // console.log(item1)
            user.value = localStorage.getItem('navigationBar')
            if (user.value) {
                let arr = JSON.parse(localStorage.getItem('navigationBar')!)
                let item = null
                item = arr.find((i: any) => {
                    return i.id === item1.id
                })
                if (!item) {
                    arr.push(item1)
                    localStorage.setItem('navigationBar', JSON.stringify(arr))
                }
            } else {
                obj.value.push(item1)
                localStorage.setItem('navigationBar', JSON.stringify(obj.value))
            }
        }
        let increase = () => {
            let arr = JSON.parse(localStorage.getItem('navigationBar')!)
            let item = null
            item = arr.find((i: any) => {
                return i.authName === home.value[0].authName
            })
            if (!item) {
                arr.push(home.value[0])
                localStorage.setItem('navigationBar', JSON.stringify(arr))
            }
        }

        //
        onMounted(() => {
            api.Menus()
                .then((res: any) => {
                    // console.log(res)
                    arr.value = res.data
                    // console.log(arr.value)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        })
        return {
            arr,
            icon,
            route,
            add,
            user,
            obj,
            obj1,
            increase
        }
    }
})
</script>

<style scoped>
.el-menu-vertical-demo {
    width: 200px;
    height: 750px;
    position: fixed;
    top: 60px;
    left: 0;
}
</style>
