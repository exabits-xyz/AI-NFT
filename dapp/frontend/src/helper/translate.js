import { i18n } from "@/localization";

function getTranslate(key) {
    return i18n.t(key);
}
/**
 * notify
 * @param {*} key
 */
export function notify(key) {
    const _key = ["notifications", key].join(".");
    return getTranslate(_key);
}

export function errors(key) {
    const _key = ["errors", key].join(".");
    return getTranslate(_key);
}
