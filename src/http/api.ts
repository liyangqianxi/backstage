import http from './';
import qs from 'qs';

export default {
    login({username, password}: {username: string; password: string}) {
        //登录
        return http.post('/login', {
            username,
            password
        });
    },
    //左侧菜单权限
    Menus() {
        return http.get('/menus');
    },

    // 用户数据列表
    Getusers({
        query,
        pagenum,
        pagesize
    }: {
        query: string;
        pagenum: number;
        pagesize: number;
    }) {
        return http.get(
            `/users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`
        );
    },
    // 添加用户
    Addusers({
        username,
        password,
        email,
        mobile
    }: {
        username: string;
        password: string;
        email: string;
        mobile: string;
    }) {
        return http.post('/users', {
            username,
            password,
            email,
            mobile
        });
    },
    // 修改用户状态
    Amend({uId, type}: {uId: number; type: boolean}) {
        return http.put(`/users/${uId}/state/${type}`);
    },
    // 编辑用户提交
    RedactUser({
        id,
        email,
        mobile
    }: {
        id: number;
        email: string;
        mobile: string;
    }) {
        return http.put(`/users/${id}`, {
            email,
            mobile
        });
    },
    // 删除单个用户
    Expurgate({id}: {id: number}) {
        return http.delete(`/users/${id}`);
    },
    // 分配用户角色
    Allocation({id, rid}: {id: number; rid: string}) {
        return http.put(`/users/${id}/role`, {
            rid
        });
    },
    // 角色列表
    Getrole() {
        return http.get('/roles');
    },

    // 订单数据列表
    Getindent({
        query,
        pagenum,
        pagesize
    }: {
        query: string;
        pagenum: number;
        pagesize: number;
    }) {
        return http.get(
            `/orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}&user_id=${''}&pay_status=${''}&is_send=${''}&order_fapiao_title=${''}&order_fapiao_company=${''}&order_fapiao_content=${''}&consignee_addr=${''}`
        );
    },
    // 基于时间统计的折线图
    intention() {
        return http.get('/reports/type/1');
    },
    // 商品分类数据列表
    categories({
        type,
        pagenum,
        pagesize
    }: {
        type?: number | null;
        pagenum?: number | null;
        pagesize: number;
    }) {
        let url = `categories`;
        if (type) {
            url += `?type=${type}`;
            if (pagenum) {
                url += `&pagenum=${pagenum}&pagesize=${pagesize}`;
            }
        }
        if (pagenum) {
            url += `?pagenum=${pagenum}&pagesize=${pagesize}`;
        }
        return http.get(url);
    },
    // 编辑提交分类
    edit({id, cat_name}: {id: number; cat_name: string}) {
        return http.put(`/categories/${id}`, {
            cat_name
        });
    },
    // 删除分类
    delete({id}: {id: number}) {
        return http.delete(`/categories/${id}`);
    },
    // 添加分类
    addition({
        cat_pid,
        cat_name,
        cat_level
    }: {
        cat_pid: number;
        cat_name: string;
        cat_level: number;
    }) {
        return http.post('/categories', {
            cat_pid,
            cat_name,
            cat_level
        });
    },
    //
    //
    //
    // 权限列表
    allRights({type}: {type: string}) {
        return http.get(`/rights/${type}`);
    },
    // 角色列表
    roleslist() {
        return http.get('/roles');
    },
    // 添加角色
    addroles({roleName, roleDesc}: {roleName: string; roleDesc: string}) {
        return http.post('roles', {
            roleName,
            roleDesc
        });
    },
    //  编辑提交角色
    Editroles({
        id,
        roleName,
        roleDesc
    }: {
        id: number;
        roleName: string;
        roleDesc: string;
    }) {
        return http.put(`roles/${id}`, {roleName, roleDesc});
    },
    // 删除角色
    delroles({id}: {id: number}) {
        return http.delete(`roles/${id}`);
    },
    // 删除角色指定权限
    deloneroles({roleId, rightId}: {roleId: number; rightId: number}) {
        return http.delete(`roles/${roleId}/rights/${rightId}`);
    },
    // 权限列表 值 list 或 tree , list 列表显示权限, tree 树状显示权限
    rightslist({type}: {type: string}) {
        return http.get(`rights/${type}`);
    },
    // 角色授权,权限 ID 列表（字符串）
    roleId({roleId, rids}: {roleId: number; rids: any}) {
        return http.post(`roles/${roleId}/rights`, qs.stringify({rids}));
    },

    //
    //
    //
    // 商品列表数据
    goods({
        query,
        pagenum,
        pagesize
    }: {
        query: string;
        pagenum: number;
        pagesize: number;
    }) {
        return http.get(
            `/goods?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`
        );
    },
    // 删除商品
    omit({id}: {id: number}) {
        return http.delete(`/goods/${id}`);
    },
    // 分类参数管理
    // 商品分类数据列表
    getcategories() {
        return http.get(`categories`);
    },
    // 参数列表
    categorie({id, sel}: {id: number; sel: any}) {
        return http.get(`categories/${id}/attributes?sel=${sel}`);
    },
    // 添加动态参数或者静态属性
    addcategories({
        id,
        attr_name,
        attr_sel,
        attr_vals
    }: {
        id: number;
        attr_name: string;
        attr_sel: string;
        attr_vals: string;
    }) {
        return http.post(`categories/${id}/attributes`, {
            attr_name,
            attr_sel,
            attr_vals
        });
    },
    //编辑提交参数
    editcategories({
        id,
        attrId,
        attr_name,
        attr_sel,
        attr_vals
    }: {
        id: number;
        attrId: number;
        attr_name: string;
        attr_sel: string;
        attr_vals: string;
    }) {
        return http.put(`categories/${id}/attributes/${attrId}`, {
            attr_name,
            attr_sel,
            attr_vals
        });
    },
    // 删除参数
    deletecategories({id, attrid}: {id: number; attrid: number}) {
        return http.delete(`categories/${id}/attributes/${attrid}`);
    },
    // 分类参数分页
    getcategories1({pagenum, pagesize}: {pagenum: any; pagesize: any}) {
        return http.get(`categories?pagenum=${pagenum}&pagesize=${pagesize}`);
    },
    // 编辑提交商品分类
    editgoos({id, cat_name}: {id: number; cat_name: string}) {
        return http.put(`categories/${id}`, {cat_name});
    },
    // 添加商品分类
    addgoos({
        cat_pid,
        cat_name,
        cat_level
    }: {
        cat_pid: number;
        cat_name: string;
        cat_level: number;
    }) {
        return http.post(`categories`, {cat_pid, cat_name, cat_level});
    },
    // 删除商品分类
    delgoos({id}: {id: number}) {
        return http.delete(`categories/${id}`);
    },
    //添加/删除分类参数标签
    updateAttributesById({
        id,
        attrId,
        attr_name,
        attr_sel,
        attr_vals
    }: {
        id: number;
        attrId: number;
        attr_name: string;
        attr_sel: string;
        attr_vals: string;
    }) {
        return http.put(`categories/${id}/attributes/${attrId}`, {
            attr_name,
            attr_sel,
            attr_vals
        });
    },
    // 上传图片
    upload() {
        return http.post(`upload`);
    },
    // 添加商品
    addgoods({
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs
    }: {
        goods_name: string;
        goods_cat: string;
        goods_price: number;
        goods_number: number;
        goods_weight: number;
        goods_introduce: string;
        pics: any;
        attrs: any;
    }) {
        return http.post(`goods`, {
            goods_name,
            goods_cat,
            goods_price,
            goods_number,
            goods_weight,
            goods_introduce,
            pics,
            attrs
        });
    }
};
