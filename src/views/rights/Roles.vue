<template>
    <!-- 角色列表 -->
    <div>
        <el-card class="box-card">
            <div class="margin-b20">
                <el-button type="primary" @click="add">添加角色</el-button>
            </div>
            <el-table :data="arr" style="width: 100%" :border="true">
                <el-table-column type="expand">
                    <template #default="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item>
                                <div v-for="(item, index) in props.row.children" :key="Number(index)">
                                    <div class="flex-a boxtag">
                                        <div class="tag">
                                            <el-tag closable :disable-transitions="false" @close="close(props.row.id, item.id)">{{ item.authName }}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </div>
                                        <div>
                                            <div v-for="(item1, index1) in item.children" :key="Number(index1)" class="flex tagwarning">
                                                <div class="twotag">
                                                    <el-tag closable :disable-transitions="false" type="success" @close="close(props.row.id, item1.id)">{{ item1.authName }}</el-tag>
                                                    <i class="el-icon-caret-right"></i>
                                                </div>
                                                <div class="flex">
                                                    <div class="margin-r20" v-for="(item2, index2) in item1.children" :key="Number(index2)">
                                                        <el-tag type="warning" closable @close="close(props.row.id, item2.id)">{{ item2.authName }}</el-tag>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="props.row.children.length === 0">暂无权限</div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="职位" prop="roleName" align="center"></el-table-column>
                <el-table-column label="描述" prop="roleDesc" align="center"></el-table-column>
                <el-table-column label="操作" prop="desc" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="mini" @click="handle(scope.row, 1)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handle(scope.row, 2)">删除</el-button>
                        <el-button type="warning" size="mini" @click="handle(scope.row, 3)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :title="id ? '编辑角色' : '添加角色'" v-model="show" width="30%">
                <el-form :model="user" :rules="rules" ref="submit" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名" prop="roleName">
                        <el-input v-model="user.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="user.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="show = false">取 消</el-button>
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog title="分配权限" v-model="flag" width="50%" @close="del">
                <el-tree :default-expand-all="true" :data="list" show-checkbox node-key="id" ref="tree" :default-expanded-keys="[2, 3]" :default-checked-keys="idlist" :props="defaultProps"></el-tree>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="flag = false">取 消</el-button>
                        <el-button type="primary" @click="determine">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
  
  <script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import api from '../../http/api'
import { ElMessage, ElMessageBox } from 'element-plus'
interface Obj {
    id: number
    roleDesc: string
    roleName: string
    children: Obj[]
}
interface Obj1 {
    roleDesc: string
    roleName: string
}
interface Obj2 {
    children: string
    label: string
}
export default defineComponent({
    setup() {
        const arr = ref<Obj[]>([]) //角色列表
        const list = ref<any[]>([]) //权限列表
        const show = ref<boolean>(false) //添加角色弹框
        const flag = ref<boolean>(false) //分配权限
        const id = ref<number>(0) //大类角色roleId id
        const idlist = ref<number[]>([])
        const isRouterAlive = ref<boolean>(true)
        const tree = ref<any>(null)
        let str = ref<string>('')
        const defaultProps = ref<Obj2>({
            children: 'children',
            label: 'authName'
        })
        const user = ref<Obj1>({
            //添加用户
            roleName: '',
            roleDesc: ''
        })
        watch(
            () => flag.value,
            (val) => {
                if (!val) {
                    // tree.value.setCheckedKeys([]);
                }
            }
        )
        // 添加用户表单验证
        const rules = ref<any>({
            roleName: [
                { required: true, message: '角色名不能为空', trigger: 'blur' },
                {
                    min: 2,
                    max: 8,
                    message: '长度在 2到 8个字符',
                    trigger: 'blur'
                }
            ]
        })
        const submit = ref<any>(null)
        const submitForm = () => {
            submit.value!.validate((valid: boolean) => {
                if (valid) {
                    if (id.value) {
                        //有id就是编辑
                        Editroles()
                    } else {
                        //没有就是添加角色
                        addroles()
                    }
                    show.value = false
                } else {
                    console.log('填写失败')
                }
            })
        }
        onMounted(() => {
            roleslist()
            rightslist()
        })
        //获取角色列表
        const roleslist = () => {
            // console.log(99999)
            api.roleslist()
                .then((res: any) => {
                    arr.value = res.data
                    // console.log(arr.value);
                })
                .catch((err) => {
                    console.log(err, '获取角色列表失败')
                })
        }
        // 操作编辑
        const handle = (item: any, num: number) => {
            id.value = item.id
            user.value.roleName = item.roleName
            if (num === 1) {
                show.value = true
            } else if (num === 2) {
                open()
            } else {
                //分配权限
                flag.value = true
                item.children.map((item1: any) => {
                    item1.children.map((item2: any) => {
                        item2.children.map((item3: any) => {
                            idlist.value.push(item3.id)
                        })
                    })
                })
                console.log(idlist.value)
                if (tree.value) {
                    tree.value.setCheckedKeys(idlist.value)
                }
            }
        }
        // 添加角色按钮
        const add = () => {
            id.value = 0
            show.value = true
        }
        // 添加角色请求
        const addroles = () => {
            api.addroles({
                roleName: user.value.roleName,
                roleDesc: user.value.roleDesc
            })
                .then((res: any) => {
                    success(res)
                    roleslist()
                })
                .catch((err) => {
                    console.log(err, '添加用户失败')
                })
        }
        // 编辑角色
        const Editroles = () => {
            api.Editroles({
                id: id.value,
                roleName: user.value.roleName,
                roleDesc: user.value.roleDesc
            })
                .then((res: any) => {
                    if (res.meta.status === 200) {
                        ElMessage.success('修改成功')
                        roleslist()
                    }
                })
                .catch((err) => {
                    console.log(err, '编辑角色失败')
                })
        }
        // 删除弹框,删除角色
        const open = () => {
            ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    api.delroles({ id: id.value })
                        .then((res: any) => {
                            console.log(res)
                            success(res)
                            roleslist()
                        })
                        .catch((err) => {
                            console.log(err, '删除失败')
                        })
                })
                .catch(() => {
                    ElMessage({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        }
        // 关闭标签
        const close = (roleId: number, rightId: number) => {
            api.deloneroles({ roleId: roleId, rightId: rightId })
                .then((res) => {
                    // console.log(res);
                    success(res)
                    roleslist()
                })
                .catch((err) => {
                    console.log(err, '删除权限失败')
                })
        }
        // 获取权限列表
        const rightslist = () => {
            api.rightslist({ type: 'tree' })
                .then((res: any) => {
                    list.value = res.data
                    // console.log(list.value);
                })
                .catch((err) => {
                    console.log(err, '获取权限列表失败')
                })
        }
        // 分配权限弹框确定按钮
        const determine = () => {
            str.value = tree.value
                .getHalfCheckedKeys()
                .concat(tree.value.getCheckedKeys())
                .join() //半选
            flag.value = false
            roleId()
        }
        // 关闭分配权限弹框
        const del = () => {
            idlist.value = []
            tree.value.setCheckedKeys([])
        }
        // 角色授权
        const roleId = () => {
            api.roleId({ roleId: id.value, rids: str.value })
                .then((res: any) => {
                    // console.log(res);
                    if (res.meta.status === 200) {
                        ElMessage.success(res.meta.msg)
                        roleslist()
                    }
                })
                .catch((err) => {
                    console.log(err, '角色授权失败')
                })
        }
        const success = (res: any) => {
            if (res.meta.status === 200) {
                ElMessage.success(res.meta.msg)
            } else {
                ElMessage.warning(res.meta.msg)
            }
        }
        return {
            arr,
            handle,
            add,
            show,
            user,
            rules,
            submitForm,
            submit,
            id,
            close,
            isRouterAlive,
            flag,
            list,
            defaultProps,
            idlist,
            del,
            tree,
            determine
        }
    }
})
</script>
  
  <style scoped>
.tag {
    margin-right: 150px;
}
.boxtag {
    border-top: 1px solid #eee;
    width: 1516px;
}
.tagwarning {
    border-bottom: 1px solid #eee;
    padding: 10px 0px;
}
.twotag {
    margin-right: 80px;
}
</style>
