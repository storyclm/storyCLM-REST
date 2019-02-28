 "use strict"
const path = require('path');
var libraryName = 'storyCLM-REST';

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/lib',
        filename: "bundle.js",
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: "source-map",
    mode: "development",
    watch: true,
    watchOptions: {
        aggregateTimeout:300
    },
    resolve: {
        alias:{
           // querystring: 'querystring-browser',
            requestCreator: path.resolve(__dirname,"src/Http/RequestCreator/Web.js"),
            promiseRepeater:path.resolve(__dirname,"src/Utils/promiseRepeater.js"),
            httpClient:path.resolve(__dirname,"src/http/httpClient.js"),
            tableClient:path.resolve(__dirname,"src/Tables/tableClient.js"),
            authorizationHttpClient:path.resolve(__dirname,"src/Http/authorizationHttpClient.js"),
            accessTokenManager:path.resolve(__dirname,"src/Http/accessTokenManager.js"),
            tableQuery:path.resolve(__dirname,"src/Tables/tableQuery.js"),
            queryManager:path.resolve(__dirname,"src/Tables/queryManager.js"),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['C:\\Breffi\\Javascript\\StoryCLM\\node_modules\\babel-preset-env']
                    }
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    }
};