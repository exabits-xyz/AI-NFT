import apiClient from "@/services/axios";

class CreateApi {
    constructor(endpoint, extendMothods) {
        this._endpoint = endpoint;
        this._apiClient = apiClient;
    }

    list(payload) {
        const endpoint = this._endpoint;
        const { filter, orderby, sort, offset, limit } = payload;
        return this._apiClient
            .get(`${endpoint}`, {
                params: { orderby, sort, offset, limit },
                filter: { filter },
            })
            .then((response) => {
                return response;
            });
    }

    create(data) {
        const endpoint = this._endpoint;
        return this._apiClient.post(`${endpoint}`, data).then((response) => {
            return response;
        });
    }

    detail(id) {
        const endpoint = this._endpoint;
        return this._apiClient.get(`${endpoint}/${id}`).then((response) => {
            return response;
        });
    }

    update(id, data) {
        const endpoint = this._endpoint;
        return this._apiClient
            .put(`${endpoint}/${id}`, data)
            .then((response) => {
                return response;
            });
    }

    del(id) {
        const endpoint = this._endpoint;
        return this._apiClient.delete(`${endpoint}/${id}`).then((response) => {
            return response;
        });
    }
}

export { CreateApi };
