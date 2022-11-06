const fs = require("fs");
const devconfig = {
    pwa: {
        iconPaths: {
            favicon32: "./resources/images/favicon-32.png",
            favicon16: "./resources/images/favicon.png",
            appleTouchIcon: "./resources/images/logo-64.png",
            maskIcon: "./resources/images/favicon.png",
            msTileImage: "./resources/images/favicon.png",
        },
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    publicPath: "/",
    lintOnSave: true,
};
if (process.env.NODE_ENV === "production") {
    const webpack = require("webpack");
    const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
    module.exports = Object.assign({}, devconfig, {
        productionSourceMap: false,
        chainWebpack: (config) => {
            config.optimization.delete("splitChunks");
            config
                .plugin("ignore")
                .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

            config.optimization
                .minimize(true)
                .minimizer("terser")
                .tap((args) => {
                    let { terserOptions } = args[0];
                    terserOptions.compress.drop_console = true;
                    terserOptions.compress.drop_debugger = true;
                    return args;
                });
        },
        configureWebpack: (config) => {
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false,
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ["console.log"], //remove console
                        },
                    },
                    sourceMap: false, //trun off sourcemap
                    parallel: true,
                })
            );
            config.optimization = {
                runtimeChunk: "single",
                splitChunks: {
                    chunks: "all",
                    maxInitialRequests: Infinity,
                    minSize: 1000 * 60,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                const packageName = module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                                )[1];
                                return `exabits.${packageName.replace(
                                    "@",
                                    ""
                                )}`;
                            },
                        },
                    },
                },
            };
        },
    });
} else {
    const fs = require("fs");
    module.exports = Object.assign({}, devconfig, {
        devServer: {
            port: 8006,
            disableHostCheck: false,
            host: "local.ai-art.exabits.xyz",
            https: true,
            key: fs.readFileSync("./ssl/local.ai-art.exabits.xyz-key.pem"),
            cert: fs.readFileSync("./ssl/local.ai-art.exabits.xyz.pem"),
            historyApiFallback: true,
            proxy: {
                "/api": {
                    secure: false,
                    target: "https://api.console.exabits.xyz/",
                    logLevel: "debug",
                    changeOrigin: true,
                },
            },
        },
    });
}
