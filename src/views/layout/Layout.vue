<template>
    <el-container>
        <el-header>
            <Welcome></Welcome>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <GuideBar></GuideBar>
            </el-aside>
            <el-main style="padding: 30px;">
                <Tabs></Tabs>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Welcome from '../../components/layout/welcome/Welcome.vue'
import GuideBar from '../../components/layout/guidebBar/GuideBar.vue'
import Tabs from '../../components/tabs/Tabs.vue'

export default defineComponent({
    components: {
        Welcome,
        GuideBar,
        Tabs
    },
    setup() {
        return {}
    }
})
</script>

<style scoped>
</style>
