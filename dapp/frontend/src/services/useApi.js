import apiClient from "@/services/axios";
export const UseApi = (() => {
    const restApi = (endpoint, apiHelper) => {
        const list = (payload) => {
            const { filter, orderby, sort, offset, limit } = payload;
            return apiHelper
                .get(`${endpoint}`, {
                    params: { orderby, sort, offset, limit },
                    filter: { filter },
                })
                .then((response) => {
                    return response;
                });
        };
        const register = (data) => {
            return apiHelper
                .post(`${endpoint}/register`, data)
                .then((response) => {
                    return response;
                });
        };
        const create = (data) => {
            return apiHelper.post(`${endpoint}`, data).then((response) => {
                return response;
            });
        };
        const detail = (id) => {
            return apiHelper.get(`${endpoint}/${id}`).then((response) => {
                return response;
            });
        };
        const update = (id, data) => {
            return apiHelper.put(`${endpoint}/${id}`, data).then((response) => {
                return response;
            });
        };
        const del = (id) => {
            return apiHelper.delete(`${endpoint}/${id}`).then((response) => {
                return response;
            });
        };
        return {
            list,
            create,
            register,
            update,
            detail,
            del,
        };
    };

    class PublicApi {
        constructor(endpoint, apiHelper = apiClient) {
            this._endpoint = endpoint;
            this._apiClient = apiHelper;
            const restApiMethods = restApi(endpoint, apiHelper);
            Object.getOwnPropertyNames(restApiMethods).forEach(
                (item) => (this[item] = restApiMethods[item])
            );
        }

        endpoint() {
            return this._endpoint;
        }

        extendList(apiName, apiPath) {
            const endpoint = this._endpoint;
            this[apiName] = (payload, idPath = "") => {
                const { filter, orderby, sort, offset, limit } = payload;

                return apiClient
                    .get(`${endpoint}/${idPath}${apiPath}`, {
                        params: { orderby, sort, offset, limit },
                        filter,
                    })
                    .then((response) => {
                        return response;
                    });
            };
        }

        extendMonitor(apiName, apiPath) {
            const endpoint = this._endpoint;
            this[apiName] = (id, payload) => {
                const { filter, start, end } = payload;
                return apiClient
                    .get(`${endpoint}/${id}/${apiPath}`, {
                        params: { start, end },
                        filter,
                    })
                    .then((response) => {
                        return response;
                    });
            };
        }

        register(methodName, callback) {
            this[methodName] = callback();
        }
    }

    return PublicApi;
})();
