const isEmpty = (val) => {
    return val === null || val === undefined;
};

const name = (name) => {
    return /^[a-z0-9-_ .!#%():@[\]]{3,15}$/i.test(name || "");
};
const integer = (val) => Number.isInteger(+val);

const color = (color) => {
    return /^#[0-9A-F]{6}$/i.test(color);
};
const noSpaces = (str) => {
    return str === "" || /^\S+$/i.test(str || "");
};

const validators = {
    name,
    integer,
    color,
    noSpaces,
};
const validator = (rule, value, callback) => {
    const { method, message, field } = rule;
    const validMethod = method || field;
    if (!validators[validMethod](value)) {
        callback(new Error(message));
    }
    callback();
};
module.exports = {
    validator,
    ...validators,
};
