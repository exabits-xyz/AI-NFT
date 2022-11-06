import apiClient from "@/services/axios";

export const authApi = () => {
    const ENDPOINT = "/auth";

    const login = (username, password) => {
        return apiClient
            .post(`${ENDPOINT}/login`, {
                username,
                password,
            })
            .then((response) => {
                return response;
            });
    };

    const logout = () => {
        return apiClient.get(`${ENDPOINT}/logout`).then((response) => {
            return response;
        });
    };

    return {
        login,
        logout,
    };
};
