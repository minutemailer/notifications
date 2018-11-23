const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: resolve(__dirname),
    resolve: {
        extensions: ['.js'],
    },
    devServer: {
        compress: true,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Notifications',
            template: resolve(__dirname, './template.html'),
        }),
    ],
};
