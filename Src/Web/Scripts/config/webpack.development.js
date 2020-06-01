const helpers = require("./helpers");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = webpackMerge(commonConfig, {
    mode: "development",

    devtool: "eval-source-map",

    output: {
        path: helpers.root("wwwroot/bundles"),
        filename: "[name].js"
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ]
});
