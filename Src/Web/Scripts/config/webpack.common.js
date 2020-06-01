const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = {
    entry: {
        bundle: "./scripts/main.js"
    },

    resolve: {
        modules: [path.join(process.cwd(), "scripts"), "node_modules"],
        extensions: [".js", ".css", ".scss", ".json"],
        symlinks: false,
        alias: {
            vue: process.env.NODE_ENV === "production" ? "vue/dist/vue.min.js" : "vue/dist/vue.js"
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: ["lodash", "@babel/plugin-proposal-object-rest-spread"],
                    presets: [["@babel/preset-env", { modules: false } ]]
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    miniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 8192
                    }
                }]
            }
        ]
    },

    plugins: [
        new LodashModuleReplacementPlugin({
            paths: true
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new CleanWebpackPlugin({
            verbose: true
        })
    ],

    stats: {
        env: true,
        all: false,
        modules: false,
        errors: true,
        warnings: true,
        assets: true,
        moduleTrace: true,
        colors: true
    }
};
