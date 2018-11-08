"use strict"
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename:"bundle.js"
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
            promiseRepeater:path.resolve(__dirname,"src/promiseRepeater.js"),
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
            }
        ]
    }
};