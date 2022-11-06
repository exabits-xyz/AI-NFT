import Vue from "vue";
import Vuex from "vuex";
import { useStorage } from "@/helper/storage";
import { translate } from "@/helper";

Vue.use(Vuex);
const authStorage = useStorage();

// action types
export const CONNECT = "connect";
export const LOAD_CURRENT_ACCOUNT = "getCurrentAccount";
export const LOGOUT = "logout";

// mutation types
export const SET_CURRENT = "setCurrent";
export const SET_READY = "setReady";
export const SET_CONNECT = "setConnect";
export const SET_ERRORS = "setErrors";
export const SET_LOGINED = "setLogined";
export const SET_LOGOUT = "setLogout";

const state = {
    current: null,
    authorized: false,
    loading: true,
    isRegistered: false,
    errors: {},
};
const getters = {
    authorized: (state) => state.authorized,
    loading(state) {
        return state.loading;
    },
    errors(state) {
        return state.errors;
    },
    current: (state) => state.current,
    isRegistered: (state) => state.isRegistered,
};
const connnecting = (address, chainId, callback, errorHandler) => {
    const message = "Welcome 3D Characters Nft Marketplace";
    const { ethereum } = window;
    ethereum
        .request({
            method: "personal_sign",
            params: [message, address],
        })
        .then((signature) => {
            const current = {
                address,
                chainId,
                signature,
                balance: 0,
            };
            callback.call(this, current);
        })
        .catch((err) => {
            errorHandler(err);
        });
};
const actions = {
    [CONNECT]({ commit, dispatch }, payload) {
        commit(SET_READY);
        const { ethereum } = window;
        const { chainId } = payload;
        ethereum
            .request({ method: "eth_accounts" })
            .then((arrayAddress) => {
                if (arrayAddress.length === 0) {
                    ethereum
                        .request({
                            method: "eth_requestAccounts",
                        })
                        .then(([connectedAddress]) => {
                            connnecting(
                                connectedAddress,
                                chainId,
                                (userInfo) => {
                                    const authorized = true;
                                    userInfo.authorized = authorized;
                                    commit(SET_CONNECT, {
                                        loading: false,
                                        current: userInfo,
                                        authorized: authorized,
                                    });
                                },
                                (errors) => {
                                    commit(SET_ERRORS, {
                                        loading: false,
                                        errors,
                                    });
                                }
                            );
                        })
                        .catch((errors) => {
                            commit(SET_ERRORS, {
                                loading: false,
                                errors,
                            });
                        });
                } else {
                    connnecting(
                        arrayAddress[0],
                        chainId,
                        (userInfo) => {
                            const authorized = true;
                            userInfo.authorized = authorized;
                            commit(SET_CONNECT, {
                                loading: false,
                                current: userInfo,
                                authorized: authorized,
                            });
                        },
                        (errors) => {
                            commit(SET_ERRORS, {
                                loading: false,
                                errors,
                            });
                        }
                    );
                }
            })
            .catch((errors) => {
                commit(SET_ERRORS, {
                    loading: false,
                    errors,
                });
            });
    },
    [LOAD_CURRENT_ACCOUNT]({ commit }) {
        commit(SET_READY);

        const authLocalInfo = authStorage.get();
        if (authLocalInfo !== false) {
            const { authorized } = authLocalInfo;
            commit(SET_CURRENT, {
                current: authLocalInfo,
                loading: false,
                authorized,
            });
        } else {
            commit(SET_LOGOUT);
        }
    },
    [LOGOUT]({ commit, dispatch }) {
        commit(SET_LOGOUT);
        dispatch("menus/cleanAuthMenus", null, { root: true });
    },
};
const mutations = {
    [SET_READY](state) {
        Object.assign(state, {
            loading: true,
            errors: null,
        });
    },
    [SET_CONNECT](state, { current, authorized, loading }) {
        Object.assign(state, {
            current,
            authorized,
            loading,
            errors: null,
        });
        authStorage.save(current);
    },
    [SET_ERRORS](state, { errors, loading }) {
        Object.assign(state, {
            loading,
            errors,
        });
    },
    [SET_CURRENT](state, { current, authorized, loading }) {
        Object.assign(state, {
            current,
            authorized,
            loading,
        });
        current && authStorage.save(current);
    },
    [SET_LOGINED](state) {
        Vue.prototype.$notification.success(translate.notify("logged"));
    },
    [SET_LOGOUT](state) {
        Object.assign(state, {
            current: null,
            authorized: false,
            loading: false,
        });
        authStorage.clear();
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
