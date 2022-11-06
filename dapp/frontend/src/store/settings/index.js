import Vue from "vue";
import Vuex from "vuex";
import { useStorage, cleanAll } from "@/helper/storage";

Vue.use(Vuex);
const settingsStorage = useStorage("settings");
const VERSION_NO = process.env.VUE_APP_VERSION;
const STORED_SETTINGS = (storedSettings) => {
    const settings = { lastVersion: VERSION_NO };
    const localSettings = settingsStorage.get();

    Object.keys(storedSettings).forEach((key) => {
        const item = localSettings[key];
        settings[key] =
            typeof item !== "undefined" ? item : storedSettings[key];
    });
    return settings;
};
// action types
export const CHANGE = "changeSettings";
export const CHECK_NETWORK = "checkNetwork";
export const CHANGE_VERSION = "checkUpgrading";
export const CHANGE_THEME = "changeTheme";
export const CHANGE_LOCALE = "changeLocale";
export const CHANGE_PRIMARY = "changePrimaryColor";
export const SETUP_URL = "setupUrl";

// mutation types
export const CHANGE_SETTINGS = "setSettings";
export const SETUP_URL_SETTINGS = "setupUrl";
export const SET_PRIMARY_COLOR = "setPrimary";
export const SET_THEME = "setTheme";
export const SET_ERROR = "setError";
export const SET_CHAIN_ID = "setChainId";
export const SET_LOCALE = "setLocale";
export const SET_READY = "setReady";

const state = {
    loading: true,
    ...STORED_SETTINGS({
        logo: "exaBITS",
        description: "",
        locale: "en-US",
        isSidebarOpen: false,
        errors: null,
        isMobileView: false,
        isMobileMenuOpen: false,
        isMenuCollapsed: false,
        menuLayoutType: "top",
        menuType: "default",
        routerAnimation: "slide-fadein-up",
        menuColor: "dark",
        flyoutMenuColor: "blue",
        authPagesColor: "image",
        theme: "default",
        primaryColor: "#8E54E9",
        chainId: 0,
        metamaskIsInstalled: false, // is installed MetaMask
        isMenuUnfixed: false,
        isMenuShadow: false,
        isCardShadow: true,
        isBorderless: false,
        version: VERSION_NO,
        copyright: `Copyright &copy; 2022-2024 <a href="https://www.exabits.xyz" target="_blank">exaBITS</a>`,
    }),
};
const getters = {
    currentTheme: (state) => state.theme,
    currentPrimaryColor: (state) => state.primaryColor,
    appLogo: (state) => state.logo,
    appDescription: (state) => state.description,
    menuType: (state) => state.menuType,
    isMenuCollapsed: (state) => state.isMenuCollapsed,
    flyoutMenuColor: (state) => state.flyoutMenuColor,
    isMenuUnfixed: (state) => state.isMenuUnfixed,
    isMenuShadow: (state) => state.isMenuShadow,
    menuColor: (state) => state.menuColor,
    menuLayoutType: (state) => state.menuLayoutType,
    isMobileMenuOpen: (state) => state.isMobileMenuOpen,
    isMobileView: (state) => state.isMobileView,
    isTabletView: (state) => state.isTabletView,
    isCardShadow: (state) => state.isCardShadow,
    isBorderless: (state) => state.isBorderless,
    routerAnimation: (state) => state.routerAnimation,
    authPagesColor: (state) => state.authPagesColor,
    copyright: (state) => state.copyright,
    locale: (state) => state.locale,
    chainId: (state) => state.chainId,
    loading: (state) => state.loading,
    errors: (state) => state.errors,
    language: (state) => state.locale.substr(0, 2),
};
const actions = {
    [CHANGE_VERSION]({ dispatch, state, commit }) {
        const { lastVersion, version } = state;
        if (lastVersion !== version) {
            commit(CHANGE_SETTINGS, {
                setting: "version",
                value: lastVersion,
            });

            dispatch("auth/logout", null, { root: true });
            cleanAll();
        }
    },
    [CHECK_NETWORK]({ commit, dispatch }, chainId) {
        const { ethereum } = window;
        const currentChainId = chainId || "";
        commit(SET_READY, true);
        ethereum.request({ method: "eth_chainId" }).then((chainId) => {
            if (chainId !== "0x5") {
                ethereum
                    .request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x5" }],
                    })
                    .then(() => {
                        dispatch(CHECK_NETWORK);
                    })
                    .catch((switchErrors) => {
                        if (switchErrors && switchErrors.code !== -32002) {
                            commit(SET_ERROR, switchErrors);
                        }
                    });
            }
            if (currentChainId !== "" && chainId !== currentChainId) {
            }
            commit(SET_CHAIN_ID, chainId);
        });
    },
    [CHANGE]({ commit }, payload) {
        commit(CHANGE_SETTINGS, payload);
    },
    [CHANGE_PRIMARY]({ commit }, payload) {
        commit(SET_PRIMARY_COLOR, payload);
    },
    [CHANGE_THEME]({ commit }, payload) {
        commit(SET_THEME, payload);
    },
    [CHANGE_LOCALE]({ commit }, payload) {
        commit(SET_LOCALE, payload);
    },
    [SETUP_URL]({ commit }, payload) {
        commit(SETUP_URL_SETTINGS, payload);
    },
};
const mutations = {
    [CHANGE_SETTINGS](state, { setting, value }) {
        state[setting] = value;
        settingsStorage.save(state);
    },
    [SET_ERROR](state, errors) {
        const errrorMsg = {
            4001: "Please switch the Ropsten Test Network",
        };
        Object.assign(state, {
            errors: {
                message: errrorMsg[errors.code] || errors.message,
            },
            loading: false,
        });
    },

    [SET_CHAIN_ID](state, chainId) {
        Object.assign(state, {
            chainId,
            loading: false,
        });
    },
    [SET_READY](state, isReady) {
        Object.assign(state, {
            loading: isReady,
            errors: null,
        });
    },
    [SET_THEME](state, payload) {
        const { theme } = payload;
        const nextTheme = theme === "dark" ? "dark" : "default";
        document
            .querySelector("html")
            .setAttribute("data-kit-theme", nextTheme);
        state.theme = nextTheme;

        settingsStorage.save(state);
    },
    [SET_LOCALE](state, locale) {
        Object.assign(state, {
            locale: locale,
        });
        settingsStorage.save(state);
    },
    [SET_PRIMARY_COLOR](state, payload) {
        const { color } = payload;
        const addStyles = () => {
            const styleElement = document.querySelector("#primaryColor");
            if (styleElement) {
                styleElement.remove();
            }
            const body = document.querySelector("body");
            const styleEl = document.createElement("style");
            const css = document.createTextNode(
                `:root { --kit-color-primary: ${color};}`
            );
            styleEl.setAttribute("id", "primaryColor");
            styleEl.appendChild(css);
            body.appendChild(styleEl);
        };
        addStyles();
        state.primaryColor = color;

        settingsStorage.save(state);
    },
    [SETUP_URL_SETTINGS](state, payload) {
        let queryParams = payload;
        let keys = false;
        if (payload.redirect) {
            const str = payload.redirect;
            const subs = str.substring(str.indexOf("?") + 1);
            if (str.indexOf("?") >= 0) {
                queryParams = JSON.parse(
                    '{"' +
                        decodeURI(subs)
                            .replace(/"/g, '\\"')
                            .replace(/&/g, '","')
                            .replace(/=/g, '":"') +
                        '"}'
                );
            }
        }
        delete queryParams.redirect;
        keys = Object.keys(queryParams);
        if (keys.length) {
            keys.forEach((key) => {
                let value;
                switch (queryParams[key]) {
                    case "false":
                        value = false;
                        break;
                    case "true":
                        value = true;
                        break;
                    default:
                        value = queryParams[key];
                        break;
                }
                if (key in state) {
                    state[key] = value;
                }
            });
        }
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};
