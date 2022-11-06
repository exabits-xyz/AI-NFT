import axios from "axios";
import apiClient from "@/services/axios";
import { useStorage } from "@/helper/storage";
export const filemanageApi = () => {
    const endpoint = "file";
    const authStorage = useStorage();
    const { address = "", signature = "" } = authStorage.get() || {};

    const upload = (formData) => {
        return apiClient
            .post(`${endpoint}/upload`, formData)
            .then((response) => {
                return response;
            });
    };

    const uploadPicture = (formData) => {
        return apiClient
            .post(`${endpoint}/upload-picture`, formData)
            .then((response) => {
                return response;
            });
    };

    const metas = (formData) => {
        return apiClient
            .post(`${endpoint}/metas`, formData, {
                setHeaders: (headers) => {
                    headers["X-ADDRESS"] = address;
                    headers["X-SIGNATURE"] = signature;
                    return headers;
                },
            })
            .then((response) => {
                return response;
            });
    };

    const load = (filename) => {
        return apiClient
            .get(`${endpoint}/load/${filename}`, {
                responseType: "arraybuffer",
            })
            .then((response) => {
                return response;
            });
    };
    const uploadConfig = (formData) => {
        return axios
            .post(`/update_config`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                return response;
            });
    };
    const loadPicture = (url) => {
        return axios
            .get(url, {
                responseType: "arraybuffer",
            })
            .then((response) => {
                return response;
            });
    };

    const loadPictures = (url) => {
        return axios.get(url).then((response) => {
            return response;
        });
    };
    return {
        upload,
        load,
        metas,
        uploadConfig,
        loadPicture,
        loadPictures,
        uploadPicture,
    };
};
