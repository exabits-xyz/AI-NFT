import "ant-design-vue/lib/style/index.less"; // antd core styles
import "./@kit/vendors/antd/themes/default.less"; // default theme antd components
import "./@kit/vendors/antd/themes/dark.less"; // dark theme antd components
import "./global.scss"; // app & third-party component styles

import Vue from "vue";
import VuePageTitle from "vue-page-title";
import NProgress from "vue-nprogress";
import VueLayers from "vuelayers";
import BootstrapVue from "bootstrap-vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { i18n } from "./localization";

import "./antd";
import "./registerServiceWorker";

Vue.use(BootstrapVue);
Vue.use(VueLayers);

Vue.use(NProgress);

Vue.use(VuePageTitle, {
    prefix: "AI NFT",
    router,
});
Vue.config.productionTip = false;

const nprogress = new NProgress({ parent: "body" });
new Vue({
    router,
    store,
    nprogress,
    i18n,
    render: (h) => h(App),
}).$mount("#app");
