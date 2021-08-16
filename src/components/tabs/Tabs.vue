<template>
    <div class="tabs">
        <div v-for="(item, index) in user" :key="item" class="demonstration">
            <el-dropdown trigger="contextmenu">
                <span class="el-dropdown-link">
                    <div class="authName" :class="$route.path === `/${item.path}` ? 'red' : ''" @click="goto(item, Number(index))">
                        <div :class="index == num ? 'circle' : ''"></div>
                        {{ item.authName }}
                        <div @click="close(Number(index))">
                            <i :class="index == num ? 'el-icon-close' : ''"></i>
                        </div>
                    </div>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <div class="left" @click="removeLeft(item,Number(index))">关闭左边</div>
                        <div class="right" @click="removeRight(item,Number(index))">关闭右边</div>
                        <div class="qi" @click="removeEver(item)">关闭其他</div>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default defineComponent({
    setup() {
        // 变量
        let router = useRouter()
        let route = useRoute()
        let user = ref<any>([])
        let num = ref<number>(-1)

        // 方法
        let goto = (item: any, index: number) => {
            num.value = index
            router.push(`/${item.path}`)
        }
        // 关闭左侧
        // 点击关闭删除标签
        let close = (index: number) => {
            let newlist = JSON.parse(localStorage.getItem('navigationBar')!)
            newlist.splice(index, 1)
            localStorage.setItem('navigationBar', JSON.stringify(newlist))
            if (index === 0) {
                if (user.value.length === 0) {
                    let arr = []
                    if (newlist) arr = newlist
                    arr.push({ name: '首页', path: '' })
                    localStorage.setItem('navigationBar', JSON.stringify(arr))
                    router.push('/')
                } else {
                    router.push('/' + user.value[index].path)
                }
            } else {
                router.push('/' + user.value[index - 1].path)
            }
        }
        // 关闭左侧
        let removeLeft = (item: any, index: number) => {
            console.log(item)
            user.value.splice(0, index)
            if (index === 0) {
                ElMessage.warning({
                    message: '已经是第一个啦',
                    type: 'warning'
                })
            }
            router.push('/' + item.path)
            localStorage.setItem('navigationBar', JSON.stringify(user.value))
        }
        // 关闭右侧
        let removeRight = (item: any, index: number) => {
            user.value.splice(index + 1, user.value.length - 1)
            if (index === user.value.length - 1) {
                ElMessage.warning({
                    message: '已经是最后一个啦',
                    type: 'warning'
                })
            }
            router.push('/' + item.path)
            localStorage.setItem('navigationBar', JSON.stringify(user.value))
        }
        // 关闭其他
        let removeEver = (item: any) => {
            console.log(item)
            let setname1 = user.value.filter((item1: any, index: number) => {
                return item.authName === item1.authName
            })
            console.log(setname1)

            if (route.path === `/${item.path}`) {
                user.value = setname1
            } else {
                router.push('/' + item.path)
                localStorage.setItem('navigationBar', JSON.stringify(setname1))
            }
        }
        watch(
            () => route.path,
            (val) => {
                console.log(val)
                user.value = JSON.parse(
                    localStorage.getItem('navigationBar') as any
                )
            }
        )
        onMounted(() => {
            user.value = JSON.parse(
                localStorage.getItem('navigationBar') as any
            )
            // console.log(user.value)
        })
        return {
            user,
            num,
            goto,
            close,
            removeLeft,
            removeRight,
            removeEver
        }
    }
})
</script>
  
  <style scoped>
.tabs {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #c0c0c0;
    margin-bottom: 10px;
}
.authName {
    display: flex;
    font-size: 12px;
    border: 1px solid #c0c0c0;
    margin-right: 5px;
    padding: 2px 10px;
}
.red {
    background: #409eff;
    color: #fff;
}
.circle {
    height: 8px;
    width: 8px;
    background: #fff;
    border-radius: 50%;
    margin-right: 5px;
    margin-top: 4px;
}
.demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
}
.left {
    margin: 5px 8px;
}
.right {
    margin: 5px 8px;
}
.qi {
    margin: 5px 8px;
}
</style>
