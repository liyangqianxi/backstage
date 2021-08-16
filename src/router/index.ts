import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import Home from '../views/Home.vue';
import Layout from '../views/layout/Layout.vue';
// import {isEqual, uniqWith} from 'lodash';
// import store from '@/store/index';

const routes: RouteRecordRaw[] = [
    {
        //登录
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'Home',
                component: Home,
                meta: {
                    title: '首页',
                    index: '/'
                }
            },
            {
                path: '/users',
                name: 'Users',
                component: () => import('../views/user/Users.vue'),
                meta: {
                    title: '用户列表',
                    index: '/users'
                }
            },
            {
                path: '/rights',
                name: 'Rights',
                component: () => import('../views/rights/Rights.vue'),
                meta: {
                    title: '权限列表',
                    index: '/rights'
                }
            },
            {
                path: '/roles',
                name: 'Roles',
                component: () => import('../views/rights/Roles.vue'),
                meta: {
                    title: '角色列表',
                    index: '/roles'
                }
            },
            {
                path: '/goods',
                name: 'Goods',
                component: () => import('../views/goods/Goods.vue'),
                meta: {
                    title: '商品列表',
                    index: '/goods'
                }
            },
            {
                path: '/params',
                name: 'Params',
                component: () => import('../views/goods/Params.vue'),
                meta: {
                    title: '分类参数',
                    index: '/params'
                }
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('../views/goods/Categories.vue'),
                meta: {
                    title: '商品分类',
                    index: '/categories'
                }
            },
            {
                path: '/orders',
                name: 'Orders',
                component: () => import('../views/orders/Orders.vue'),
                meta: {
                    title: '订单列表',
                    index: '/orders'
                }
            },
            {
                path: '/reports',
                name: 'Reports',
                component: () => import('../views/reports/Reports.vue'),
                meta: {
                    title: '数据报表',
                    index: '/reports'
                }
            },
            {
                path: '/append',
                name: 'Append',
                component: () => import('../views/goods/Append.vue'),
                meta: {
                    title: '添加商品',
                    index: '/goods'
                }
            }
        ]
    },
    {
        //404
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import('../views/404/404.vue'),
        meta: {
            title: '404'
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title as string;
    if (to.path === '/login') {
        next();
    } else {
        localStorage.getItem('username') ? next() : next('/login');
    }
});

export default router;
