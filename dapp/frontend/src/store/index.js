import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import settings from "./settings";
import menus from "./menus";
import requestProvider from "./requestProvider";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        settings,
        menus,
        requestProvider,
    },
    state: {},
    mutations: {},
    actions: {},
});
