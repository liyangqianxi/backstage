<template>
    <!-- 权限 -->
    <el-card class="box-card">
        <el-table :data="arr" border style="width: 100%">
            <el-table-column type="index" label="#" width="128" align="center"></el-table-column>
            <el-table-column prop="authName" label="权限管理" width="280" align="center"></el-table-column>
            <el-table-column prop="1" label="权限等级" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
                    <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '../../http/api'
interface obj {
    id: number
    authName: string
    level: string
    path: string
    pid: number
}
export default defineComponent({
    setup() {
        onMounted(() => {
            api.allRights({
                type: 'list'
            })
                .then((res: any) => {
                    // console.log(res);
                    arr.value = res.data
                    // console.log(arr);
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        let arr = ref<obj[]>([])
        return {
            arr
        }
    }
})
</script>
  
  <style scoped>
</style>
