"use strict"
const path = require('path');
var libraryName = 'storyCLM-REST';
var fs = require("fs");
var aliasConfig = {
    // querystring: 'querystring-browser',
    requestCreator$: path.resolve(__dirname, "src/Http/RequestCreator/Web.js"),
    promiseRepeater$: path.resolve(__dirname, "src/Utils/promiseRepeater.js"),
    httpClient: path.resolve(__dirname, "src/http/httpClient.js"),
    tableClient$: path.resolve(__dirname, "src/Tables/tableClient.js"),
    authorizationHttpClient: path.resolve(__dirname, "src/Http/authorizationHttpClient.js"),
    accessTokenManager$: path.resolve(__dirname, "src/Http/accessTokenManager.js"),
    tableQuery: path.resolve(__dirname, "src/Tables/tableQuery.js"),
    queryManager$: path.resolve(__dirname, "src/Tables/queryManager.js"),
};
var babelConfigFilePath = path.resolve(__dirname, ".babelrc");
var babelConfig = JSON.parse(fs.readFileSync(babelConfigFilePath));

babelConfig.cacheDirectory = true;
var moduleConfig = {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                query: babelConfig
            }
        }
    ]
};

var resolveConfig = {
    //root: path.resolve('./src'),
    //extensions: ['.js'],
    alias: aliasConfig
};

module.exports = [
    {
        mode:"development",
        name: "all",
        entry: __dirname + '/src/index.js',
        output: {
            path: __dirname + '/all',
            filename: "index.js",
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: moduleConfig,
        resolve: resolveConfig
    },
    {
        name: "http",
        entry: __dirname + '/src/Http/index.js',
        output: {
            path: __dirname + '/http',
            filename: "index.js",
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: moduleConfig,
        resolve: resolveConfig
    },
    {
        name: "table",
        entry: __dirname + '/src/Tables/index.js',
        output: {
            path: __dirname + '/tables',
            filename: "index.js",
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: moduleConfig,
        resolve: resolveConfig
    }
];