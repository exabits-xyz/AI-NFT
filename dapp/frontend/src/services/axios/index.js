import axios from "axios";
import { notification } from "ant-design-vue";
import router from "@/router";
import { useStorage } from "@/helper/storage";
import { translate } from "@/helper";

const authStorage = useStorage();
const settingsStorage = useStorage("settings");

const authJwtToken = (() => {
    const jwtStorage = useStorage("jwt");
    const save = (headers) => {
        const jwtToken = jwtStorage.get() || {};
        if (headers["refresh-jwt"]) {
            jwtToken["refresh-jwt"] = headers["refresh-jwt"];
        }
        if (headers["refresh-token"]) {
            jwtToken["refresh-token"] = headers["refresh-token"];
        }
        jwtStorage.save(jwtToken);
    };
    const setHeaders = (header) => {
        const jwtToken = jwtStorage.get() || {};
        if (jwtToken["refresh-jwt"]) {
            header["refresh-jwt"] = jwtToken["refresh-jwt"];
            header.authorization = "Bearer " + jwtToken["refresh-jwt"];
        }
        if (jwtToken["refresh-token"]) {
            header["refresh-token"] = jwtToken["refresh-token"];
        }
        return header;
    };
    return {
        save,
        setHeaders,
    };
})();

const apiClient = axios.create({
    baseURL: "/api/v1",
});
let timeout = false;
apiClient.interceptors.request.use((request) => {
    let { params, filter, setHeaders = null } = request;
    if (filter) {
        params = Object.assign({}, params, filter);
        request.params = params;
    }
    const headers = request.headers;
    request.headers = authJwtToken.setHeaders(request.headers);
    setHeaders && (request.headers = setHeaders(headers));
    return request;
});
// interceptors
apiClient.interceptors.response.use(
    (response) => {
        if (response.data instanceof ArrayBuffer) {
            const { headers, data } = response;
            return {
                blobData: data,
                fileName: ((strDispostion) => {
                    if (
                        strDispostion &&
                        strDispostion !== "" &&
                        strDispostion.split("filename=").length > 1
                    ) {
                        return decodeURIComponent(
                            strDispostion.split("filename=")[1]
                        );
                    } else {
                        return "nodata";
                    }
                })(headers["content-disposition"]),
            };
        } else {
            if (response.headers) {
                authJwtToken.save(response.headers);
            }
            if (response.data) {
                return response.data;
            } else {
                if (response.status < 210) {
                    return { message: "success" };
                } else {
                    return Promise.reject(response);
                }
            }
        }
    },
    (error) => {
        // Errors handling
        let message = "";

        if (error.response) {
            const errorMessage = {
                401: translate.errors("noauth"),
                403: translate.errors("noAccess"),
                404: translate.errors("nopage"),
                405: translate.errors("noAllowed"),
            };
            const { status: httpStatus, data: errorData } = error.response;
            message = errorMessage[httpStatus] || errorData.error;

            switch (httpStatus) {
                case 401:
                    authStorage.clear();
                    break;
                default:
                    errorData.code = httpStatus;
                    errorData.error = message;
                    return Promise.reject(errorData);
            }
        } else {
            message = error;
        }
        if (message && message.message) {
            message = message.message;
        }
        if (timeout) {
            clearTimeout(timeout);
        }

        if ([401].includes(error.response.status)) {
            if (router.currentRoute.path !== "/auth/login") {
                timeout = setTimeout(() => {
                    router.push("/auth/login");
                }, 500);
            } else {
                return Promise.reject(error.response.data);
            }
        } else {
            timeout = setTimeout(() => {
                notification.warning({
                    message: message,
                });
            }, 500);
        }
    }
);
apiClient.all = (tasks, finished) => {
    axios.all(tasks.map((task) => task())).then(
        axios.spread((...perms) => {
            finished(perms);
        })
    );
};
export default apiClient;
