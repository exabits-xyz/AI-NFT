import apiClient from "@/services/axios";

export const usersApi = () => {
    const ENDPOINT = "/users";
    const isregistered = (address) => {
        return apiClient
            .get(`${ENDPOINT}/isregistered`, {
                params: { address },
            })
            .then((response) => {
                return response;
            });
    };
    const connnect = (data) => {
        return apiClient.post(`${ENDPOINT}/connnect`, data).then((response) => {
            return response;
        });
    };
    const logout = () => {
        return apiClient.get(`${ENDPOINT}/logout`).then((response) => {
            return response;
        });
    };
    return {
        isregistered,
        logout,
        connnect,
    };
};
