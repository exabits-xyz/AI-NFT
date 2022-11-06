import providers from "./providers";

// action types
export const REQ_DATA = "reqData";
export const SYNC_DATA = "syncData";
export const REQ_INIT = "reqInit";

// mutation types
export const SET_REQ = "setRequest";

export const SET_READY = "setReady";

export const SET_ERRORS = "setErrors";

const state = {
    loading: true,
    errors: null,
    response: null,
    module: null,
};
const getters = {
    loading(state) {
        return state.postLoading;
    },
    reqErrors(state) {
        return state.errors;
    },
    response(state) {
        return state.putLoading;
    },
};
const actions = {
    [REQ_INIT]({ commit }, payload) {
        const { module } = payload;
        commit(SET_READY, {
            loading: false,
            module,
        });
    },
    [SYNC_DATA]({ commit }, payload) {
        const { module, method, data = {} } = payload;
        commit(SET_READY, {
            loading: true,
            module,
        });
        return providers[module][method](data.form, data.id || 0);
    },
    [REQ_DATA]({ commit }, payload) {
        const { module, method, data, success, complated } = payload;
        commit(SET_READY, {
            loading: true,
            module,
        });
        const requestData = data || { form: undefined };
        providers[module][method](requestData.form, requestData.id || 0)
            .then((response) => {
                success(response);
                commit(SET_REQ, response);
            })
            .catch((errors) => {
                complated(errors);
                commit(SET_ERRORS, errors);
            });
    },
};
const mutations = {
    [SET_READY](state, payload) {
        const { loading, module } = payload;
        Object.assign(state, {
            loading,
            module,
            response: null,
            errors: null,
        });
    },
    [SET_ERRORS](state, errors) {
        const field = errors.error;
        const errorCode = errors.code || 500;
        Object.assign(state, {
            loading: false,
            errors: {
                message: "Internal Server Error",
                description: `【${errorCode}】${field}`,
            },
        });
    },
    [SET_REQ](state, response) {
        Object.assign(state, {
            loading: false,
            errors: null,
            response: response,
        });
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
