import { cloneDeep, upperFirst, round } from "lodash";
import { customAlphabet } from "nanoid";

const { DateTime, Settings } = require("luxon");

const arrayHelper = (() => {
    const find = (array, predicate) => array.find(predicate);

    return {
        find,
    };
})();
const utilHelper = (() => {
    Settings.defaultZone = "Asia/Shanghai";
    const createStorageKey = () => {
        const appHost = window.location.hostname;
        const hostNames = appHost.split(".");
        hostNames.length = 3;
        return hostNames.join(".");
    };
    const deepCopy = (data) => {
        return cloneDeep(data);
    };

    const toJson = (strJson) => {
        try {
            return JSON.parse(JSON.stringify(strJson));
        } catch (error) {
            return {};
        }
    };

    const turnPagination = (
        { pagination, filters, sorter, defaultSort, assignOpts },
        paginationFn
    ) => {
        const { field, order, columnKey } = sorter;
        if (order) {
            pagination.sort = order.replace("end", "");
            pagination.orderby = columnKey || field;
        } else {
            pagination = { ...pagination, ...defaultSort };
        }
        pagination = { ...pagination, ...assignOpts };
        paginationFn(pagination);
    };
    const menusToTree = ({ menus, operations }) => {
        const getOperation = (pageName) => operations[pageName] || [];
        const updateMenus = (list) => {
            list.map((item) => {
                if (!item.subMenus) {
                    item.subMenus = getOperation(item.pageName);
                } else {
                    return updateMenus(item.subMenus);
                }
                return item;
            });
            return list;
        };
        return updateMenus(deepCopy(menus));
    };
    /**
     * createPrimaryId
     * @param {*} index
     * @returns
     */
    const createPrimaryId = (index = 1) => {
        const createID = customAlphabet(
            "abcdefghijklmnopq123456789ABCDEFGHIJKLMOPQ",
            8 + index
        );
        return createID();
    };

    const setImage = (imageUrl) => {
        if (imageUrl === "") {
            imageUrl = "/resources/images/nopic.jpg";
        }
        return `background-image: url('${imageUrl}') `;
    };
    const checkMetaMask = () => typeof window.ethereum !== "undefined";
    const getChainNetwork = (chainId) => {
        const chainNetwoks = {
            "0x1": "Ethereum Mainnet",
            "0x3": "Ropsten Test Network",
            "0x5": "Goerli Test Network",
        };
        return chainNetwoks[chainId];
    };
    return {
        toJson,
        createStorageKey,
        deepCopy,
        menusToTree,
        createPrimaryId,
        turnPagination,
        setImage,
        checkMetaMask,
        getChainNetwork,
    };
})();

/**
 * turnPagination
 * @param {*} param0  defaultSort:{sort:"desc",orderby:"start_time"};assignOpts:{filter:"过滤搜索对象"}
 * @param {*} paginationFn
 */
export function turnPagination(
    { pagination, filters, sorter, defaultSort, assignOpts },
    paginationFn
) {
    const { field, order, columnKey } = sorter;
    if (order) {
        pagination.sort = order.replace("end", "");
        pagination.orderby = columnKey || field;
    } else {
        pagination = { ...pagination, ...defaultSort };
    }
    pagination = { ...pagination, ...assignOpts };
    paginationFn(pagination);
}
export function ucFirst(str) {
    return upperFirst(str);
}
export function convertDateTime(timestamp, format = "yyyy-MM-dd HH:mm:ss") {
    return DateTime.fromSeconds(timestamp).toFormat(format);
}
export function convertStrDate(strTime, format = "yyyy-MM-dd HH:mm") {
    return DateTime.fromISO(strTime).toFormat(format);
}
export function getCurrentPath(router) {
    const currentRouter = router.history.current;
    const path = currentRouter.path;
    const arrayPath = path.split("/");
    const query = currentRouter.query;
    return {
        name: currentRouter.name || "",
        path: arrayPath[arrayPath.length - 1],
        query,
    };
}
export function getTableSerail(index, pagination) {
    const { pageSize, current } = pagination || {
        pageSize: 20,
        current: 1,
    };
    return (current - 1) * pageSize + index + 1;
}
export function objEach(obj, callback) {
    Object.keys(obj).forEach((key) => callback(obj[key], key, obj));
}
export function toFloor(val, precision) {
    return round(val, precision);
}
export function deepCopy(data) {
    return cloneDeep(data);
}
export function getNow() {
    return DateTime.now().toUnixInteger();
}
export function getDiffTime(start, end) {
    return end - start;
}
export { arrayHelper, utilHelper };
