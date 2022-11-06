import Vue from "vue";
import Router from "vue-router";
import AuthLayout from "@/@crayon/layout/Auth";
import MainLayout from "@/@crayon/layout/Main";
import store from "@/store";

Vue.use(Router);

const router = new Router({
    base: process.env.BASE_URL,
    mode: "history",
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: "/",
            name: "home",
            component: MainLayout,
            meta: {
                authRequired: true,
                hidden: true,
            },
            children: [
                {
                    path: "/",
                    name: "dashboard-default",
                    meta: {
                        title: "Analytics",
                        authRequired: true,
                    },
                    component: () => import("./views/dashboard/default"),
                },
                {
                    path: "/art/generator",
                    name: "art-generator",
                    meta: {
                        title: "AI Art Generator",
                        authRequired: true,
                    },
                    component: () => import("./views/art/generator"),
                },
                {
                    path: "/nfts/detail/:id",
                    name: "nft-detail",
                    meta: {
                        title: "Nft Detail",
                        authRequired: true,
                    },
                    component: () => import("./views/nfts/detail"),
                },
            ],
        },
        {
            path: "/auth",
            component: AuthLayout,
            redirect: "auth/login",
            children: [
                {
                    path: "/auth/404",
                    meta: {
                        title: "Error 404",
                    },
                    component: () => import("./views/auth/404"),
                },
                {
                    path: "/auth/500",
                    meta: {
                        title: "Error 500",
                    },
                    component: () => import("./views/auth/500"),
                },
                {
                    name: "login",
                    path: "/auth/login",
                    meta: {
                        title: "Login",
                    },
                    component: () => import("./views/auth/login"),
                },
            ],
        },
        {
            path: "*",
            redirect: "auth/404",
            hidden: true,
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    store.dispatch("auth/getCurrentAccount");
    const authorized = store.state.auth.authorized;
    if (to.matched.some((record) => record.meta.authRequired)) {
        if (!authorized) {
            next({
                path: "/auth/login",
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
    } else {
        next();
    }
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

export default router;
