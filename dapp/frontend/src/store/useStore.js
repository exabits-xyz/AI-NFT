const createStore = (apiServices, formatter) => {
    // action types
    const GET_LIST = "loadList";
    const REFRESH_LIST = "refreshList";
    const GET_DETAIL = "loadDetail";
    const UPDATE_PAGER = "updatePagination";

    // mutation types
    const SET_LIST = "setList";
    const SET_DETAIL = "setDetail";
    const SET_DETAIL_READY = "setDetailReady";
    const SET_PAGER = "setPagination";
    const SET_READY = "setReady";
    const SET_ERRORS = "setErrors";
    // pagination settings
    const PAGE_SIZE = 10;
    const PAGE_MODEL = {
        current: 1,
        pageSize: PAGE_SIZE,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
    };

    const state = {
        list: [],
        detail: {},
        pagination: {
            ...PAGE_MODEL,
        },
        loading: true,
        refreshLoading: true,
        detailLoading: true,
        errors: null,
    };
    const getters = {
        detail(state) {
            if (formatter && typeof formatter.detail === "function") {
                return formatter.detail(state.detail);
            } else {
                return state.detail;
            }
        },
        dataSource(state) {
            return state.list;
        },
        pagination(state) {
            return state.pagination;
        },
        loading(state) {
            return state.loading;
        },
        refreshLoading(state) {
            return state.refreshLoading;
        },
        errors(state) {
            return state.errors;
        },
    };
    const actions = {
        [REFRESH_LIST]({ commit }, payload) {
            const params = Object.assign(
                {
                    offset: 0,
                    limit: PAGE_SIZE,
                },
                payload
            );
            commit(SET_PAGER, payload);
            commit(SET_READY, {
                refreshLoading: true,
            });
            apiServices
                .list(params)
                .then((reponse) => {
                    commit(SET_LIST, reponse);
                    commit(SET_READY, {
                        refreshLoading: false,
                    });
                })
                .catch((errors) => {
                    commit(SET_ERRORS, {
                        refreshLoading: false,
                        errors: errors,
                    });
                });
        },
        [GET_LIST]({ commit }, payload) {
            const params = Object.assign(
                {
                    offset: 0,
                    limit: PAGE_SIZE,
                },
                payload
            );
            commit(SET_PAGER, payload);
            commit(SET_READY, {
                loading: true,
            });
            apiServices
                .list(params)
                .then((reponse) => {
                    commit(SET_LIST, reponse);
                    commit(SET_READY, {
                        loading: false,
                    });
                })
                .catch((errors) => {
                    commit(SET_ERRORS, {
                        loading: false,
                        errors: errors,
                    });
                });
        },
        [GET_DETAIL]({ commit }, payload) {
            const { id, refresh } = payload;
            if (refresh) {
                apiServices
                    .detail(id)
                    .then((reponse) => {
                        commit(SET_DETAIL, reponse);
                    })
                    .catch((errors) => {});
            } else {
                commit(SET_DETAIL_READY, true);
                apiServices
                    .detail(id)
                    .then((reponse) => {
                        commit(SET_DETAIL, reponse);
                    })
                    .catch((errors) => {
                        commit(SET_ERRORS, {
                            loading: false,
                            errors: errors,
                        });
                    });
            }
        },
        [UPDATE_PAGER](context, payload) {
            const { pageSize, current } = payload;
            const offset = pageSize * (current - 1);
            payload.offset = offset;
            payload.limit = pageSize;
            actions[GET_LIST](context, payload);
        },
    };
    const mutations = {
        [SET_DETAIL](state, detail) {
            Object.assign(state, {
                detail,
                loading: false,
                errors: null,
            });
        },
        [SET_PAGER](state, payload) {
            if (payload) {
                const { orderby, sort, filter, limit } = payload;
                const offset = payload.offset || 0;
                const pageCurrent = offset / limit + 1;

                const pagination = Object.assign(PAGE_MODEL, {
                    current: pageCurrent || 1,
                    pageSize: limit || PAGE_SIZE,
                    orderby: orderby,
                    sort: sort,
                    filter,
                });
                Object.assign(state, {
                    pagination,
                });
            }
        },
        [SET_ERRORS](state, payload) {
            const { loading, errors } = payload;
            Object.assign(state, {
                loading,
                errors,
            });
        },
        [SET_DETAIL_READY](state, isReady) {
            Object.assign(state, {
                detailLoading: isReady,
                detail: null,
                errors: null,
            });
        },
        [SET_READY](state, readyOpts) {
            Object.assign(state, {
                errors: null,
                ...readyOpts,
            });
        },
        [SET_LIST](state, response) {
            const { data, total } = response;
            Object.assign(state, {
                list: data,
            });
            const { pagination } = state;
            if (total <= pagination.pageSize) {
                Object.assign(state, {
                    pagination: false,
                });
            } else {
                Object.assign(state, {
                    pagination: {
                        total: total,
                        ...state.pagination,
                    },
                });
            }
        },
    };

    return {
        namespaced: true,
        state,
        actions,
        mutations,
        getters,
    };
};
export { createStore };
