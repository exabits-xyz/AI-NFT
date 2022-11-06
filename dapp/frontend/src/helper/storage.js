import { utilHelper } from "./utility";

/**
 * localStorage helper
 * @param {*} valKey
 * @returns
 */
export const useStorage = (valKey = "authorization") => {
    const storageKey = utilHelper.createStorageKey();
    const localKey = `${valKey}.${storageKey}`;
    const save = (data) => {
        window.localStorage.setItem(
            localKey,
            JSON.stringify(utilHelper.deepCopy(data))
        );
    };

    const get = () => {
        const localData = window.localStorage.getItem(localKey);
        if (localData && localData !== "") {
            return JSON.parse(localData);
        } else {
            return false;
        }
    };
    /**
     * clear localStorage
     */
    const clear = () => {
        window.localStorage.setItem(localKey, "");
    };
    return {
        save,
        get,
        clear,
    };
};
export const cleanAll = () => {
    window.localStorage.clear();
};
