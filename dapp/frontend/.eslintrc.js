module.exports = {
    root: true,
    parserOptions: {
        parser: "babel-eslint",
    },
    env: {
        browser: true,
    },
    extends: ["plugin:vue/essential", "standard"],
    plugins: ["vue"],
    rules: {
        indent: ["off", 2],
        quotes: [0, "single"],
        "no-mixed-spaces-and-tabs": [2, false], // Do not mix tabs and Spaces
        "generator-star-spacing": "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "space-before-function-paren": "off",
        "no-var": "off", // Use let and const instead of var
        "no-new-func": "error", //not used new Function
        camelcase: [0, { properties: "never" }],
        "comma-dangle": ["error", "only-multiline"],
        "no-multiple-empty-lines": [2, { max: 3, maxEOF: 0 }],
        semi: [2, "always"], // The statement enforces a semicolon ending
        "prettier/prettier": [
            "off",
            {
                singleQuote: false,
                semi: false,
                trailingComma: "none",
                bracketSpacing: true,
                jsxBracketSameLine: true,
            },
        ],
    },
};
