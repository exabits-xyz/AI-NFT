import {
    allMenus,
    allOperations,
    rbacOfMenus,
    mustPermissions,
    administratorMenus,
} from "./data";
import { useStorage } from "@/helper/storage";
import router from "@/router";
import { utilHelper } from "@/helper/utility";

const menusStorage = useStorage("menus");
const operationsStorage = useStorage("operations");
// action types
export const GET_MENUS = "getAuthMenus";
export const AUTH_MENUS = "authMenus";
export const CLEAN_MENUS = "cleanAuthMenus";
export const UPDATE_ACTIVE = "updateActiveMenu";
export const UPDATE_SUB_ACTIVE_NAME = "updateActiveSubPageName";
export const UPDATE_PAGER = "updatePagination";
// mutation types
export const SET_MENUS = "setAuthMenus";
export const SET_INIT_MENUS = "setInitAuthMenus";
export const SET_ACTIVE_MENU = "setActiveMenu";
export const SET_ACTIVE_LOADING = "setActiveMenuLoading";
export const SET_SUB_ACTIVE_NAME = "setActiveSubPageName";
export const SET_READY = "setReady";
export const SET_ERROR = "setError";

const allButtonOperations = Object.values(allOperations).flat();

/**
 * get default home page
 * @param {*} list
 * @returns
 */
const findHomeRouteName = (list) => {
    for (const item of list) {
        if (item.subMenus) {
            return findHomeRouteName(item.subMenus);
        } else {
            return item.pageName;
        }
    }
};
/**
 * find actived menu
 * @param {*} menus
 * @param {*} routeName
 * @param {*} oldItem
 * @returns
 */
const findActiveMenu = (menus, routeName, oldItem = {}) => {
    let match = false;
    let parentMatch = false;
    for (let i = 0, len = menus.length; i < len; i++) {
        const item = menus[i];
        if (item.pageName === routeName) {
            match = item;
            !parentMatch && (parentMatch = oldItem.pageName || "");
            match = {
                activeMenu: match,
                activeSubPageName: parentMatch,
            };
            break;
        } else if (!match && item.subMenus) {
            match = findActiveMenu(item.subMenus, routeName, item);
        }
    }
    return match;
};
const findActiveOperation = (operations, routeName) => {
    let match = false;
    const keys = Object.keys(operations);
    const keysCount = keys.length;
    for (let i = 0; i < keysCount; i++) {
        const currentKey = keys[i];
        if (
            operations[currentKey].some((item) => item.pageName === routeName)
        ) {
            match = currentKey;
            break;
        }
    }
    return match;
};

const findAllOperations = (operations) => {
    const authOperations = {};
    const copyOperations = utilHelper.deepCopy(operations);
    Object.keys(copyOperations).forEach((menuKey) => {
        const currentOperations = copyOperations[menuKey];
        if (currentOperations) {
            const currentAuths = {};
            currentOperations.forEach((current) => {
                const { key, title, icon } = current;
                // authOperations[]
                currentAuths[key] = {
                    title,
                    icon,
                    key: `${key}`,
                    id: `${menuKey}-${key}`,
                };
            });
            if (Object.keys(currentAuths).length > 0) {
                authOperations[menuKey] = currentAuths;
            }
        }
    });
    return authOperations;
};

const state = {
    menus: [],
    homeRouteName: "",
    operations: utilHelper.deepCopy(allOperations),
    rbacOfOperations: utilHelper.deepCopy(allOperations),
    rbacOfMenus: utilHelper.deepCopy(rbacOfMenus),
    buttonsOperations: allButtonOperations,
    authOperations: null,
    activeOperations: [],
    mustPermissions: utilHelper.deepCopy(mustPermissions),
    activeMenu: null,
    activeSubPageName: "",
    routerLoading: false,
};

const getters = {
    authList: (state) => state.menus,
    mustPermissions: (state) => state.mustPermissions,
    rbacOfMenus: (state) => state.rbacOfMenus,
    rbacOfOperations: (state) => state.rbacOfOperations,
    buttonOperations: (state) => state.buttonsOperations,
    authOperations: (state) => {
        const { authOperations, activeMenu } = state;
        if (authOperations && activeMenu) {
            const { pageName } = activeMenu;
            return authOperations[pageName] || {};
        } else {
            return {};
        }
    },
    routerLoading: (state) => state.routerLoading,
    treeList: (state) => {
        return utilHelper.menusToTree(state);
    },
    homeName: (state) => state.homeRouteName,
    activeMenu: (state) => state.activeMenu,
    activePageName: (state) => {
        return state.activeMenu ? state.activeMenu.pageName || "" : "";
    },
    activeSubPageName: (state) => state.activeSubPageName,
};
const actions = {
    [CLEAN_MENUS]({ commit }) {
        commit(SET_INIT_MENUS, {
            menus: [],
            activeMenu: null,
            activeOperations: [],
            activeSubPageName: "",
            operations: null,
        });
    },
    [GET_MENUS]({ commit, dispatch }) {
        const authMenus = menusStorage.get();
        const authOperations = operationsStorage.get();
        if (authMenus !== false) {
            commit(SET_MENUS, {
                menus: authMenus,
                operations: authOperations,
            });
        } else {
            dispatch("auth/logout", null, { root: true });
        }
    },
    [AUTH_MENUS]({ commit, state }, { role }) {
        menusStorage.clear();
        operationsStorage.clear();
        const operations = state.operations;
        const arrayAllMenus = utilHelper.deepCopy(allMenus);
        const extendMenus = role === "administrator" ? administratorMenus : [];
        commit(SET_INIT_MENUS, {
            menus: [...arrayAllMenus, ...extendMenus],
            operations: findAllOperations(operations),
        });
    },
    [UPDATE_ACTIVE]({ commit, state }, { route }) {
        if (route.name === "home") {
            const homeRouteName = state.homeRouteName;
            setTimeout(() => {
                router.push({ name: homeRouteName }).catch(() => {});
            }, 500);
        }
        commit(SET_ACTIVE_LOADING, true);
        commit(SET_ACTIVE_MENU, route);
    },
    [UPDATE_SUB_ACTIVE_NAME]({ commit }, { name }) {
        commit(SET_SUB_ACTIVE_NAME, name);
    },
};
const mutations = {
    [SET_ACTIVE_LOADING](state, isLoading) {
        state.routerLoading = isLoading;
    },
    [SET_MENUS](state, { menus, operations }) {
        const homeRouteName = findHomeRouteName(menus);
        Object.assign(state, {
            menus,
            homeRouteName,
            authOperations: operations,
        });
        menusStorage.save(menus);
        operationsStorage.save(operations);
    },
    [SET_INIT_MENUS](state, { menus, operations }) {
        const homeRouteName = findHomeRouteName(menus);
        Object.assign(state, {
            menus,
            authOperations: operations,
            homeRouteName,
        });
        menusStorage.save(menus);
        operationsStorage.save(operations);
        setTimeout(() => {
            router.push({ name: homeRouteName }).catch(() => {});
        }, 500);
    },
    [SET_ACTIVE_MENU](state, route) {
        const { menus, operations } = state;
        const routeName = route.name;
        const activeOperation = findActiveOperation(operations, routeName);
        const newCurrentActive = findActiveMenu(
            menus,
            activeOperation || routeName
        );

        Object.assign(state, newCurrentActive);
        state.routerLoading = false;
    },
    [SET_SUB_ACTIVE_NAME](state, pageName) {
        state.activeSubPageName = pageName;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
