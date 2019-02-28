/*!
* StoryCLM Library v1.7.6
* Copyright(c) 2018, Alexey Tselikovsky, Breffi Inc. All rights reserved.
* License: Licensed under The MIT License.
*/
//promiseRepeaterСonstructor - оборачивает фабрику промиса, чтобы в случае краша еще раз создать промис и выполнить его
//requestCreator - создатель запросов  - та самая платформозависимая штука

import promiseRepeater from "promiseRepeater";
import requestCreator from "requestCreator";
import  param from 'jquery-param';
export let noInternetException = function (error) {
        this.error = error;
    };
export let HttpClient = function () {

    var self = this;

    var auth = null; // промис аутентификации
    var intercept = function (requestArgs) { //как пример перехватчика
        return new Promise(function (resolve, reject) {
            return resolve(requestArgs);
        });
    };
    var noInternetCallback;

    self.setInterceptor = function (promiseCreator) {
        intercept = promiseCreator;
        return self;
    }
    self.setAuth = function (authPromiseCreator) {
        auth = authPromiseCreator;
        return self;
    }
    self.setNoInternetCallBack = function (_noInternetCallback) {
        noInternetCallback = _noInternetCallback;
    }

    //повторятель промисов при отсутствии интернета
    var networkFailureRepeater = new promiseRepeater(
        5, //попыток
        function (error) { //условие повторения в зависимости от ошибки
            return error.status == 0; //повторяем запрос в случае отсутствия инета
        },
        function (error, attemptNumber) {
            if (noInternetCallback) noInternetCallback(attemptNumber);
            return new Promise(function (resolve) {
                setTimeout(resolve, 1000);
            });
        }
    );

    //повторятель промисов при ошибки авторизации
    var authRepeater = new promiseRepeater(
        3, //попытки
        function (error) { //условие повторения в зависимости от ошибки
            return error.status == 401; //повторяем промис в случае ошибки авторизации
        },
        function () {
            if (auth) return auth();
        }); //перед следующей попыткой - аутентифицироваться


    var getHeaders = function () {
        var headers = {
            "Accept": "application/json",
            "Accept-Language": "en-us,en;q=0.5",
            "Content-Type": "application/json"
        };
        return headers;
    };

    this.PostForm = function (url, entry) {
        var headers = getHeaders();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        return this.Post(url, param(entry), headers);
    };

    this.PostJSON = function (url, entry) {
        var headers = getHeaders();
        return this.Post(url, JSON.stringify(entry), headers);
    };

    this.Post = function (url, stringBody, headers) {
        return request("Post", url, stringBody, headers);
    };

    this.Put = function (url, entry) {
        return request("Put", url, JSON.stringify(entry), getHeaders());
    }

    this.Get = function (url, paramsObj) {
        if (paramsObj) url += "?" + param(paramsObj, true);
        return request("Get", url, null, getHeaders());
    }

    this.Delete = function (url, headers) {
        return request("Delete", url, null, getHeaders());
    }

    var request = function (method, url, stringbody, headers) {
        return authRepeater.repeat(function () {
            return networkFailureRepeater.repeat(
                function () {
                    var requestArgs = {
                        method: method,
                        url: url,
                        stringbody: stringbody,
                        headers: headers
                    };
                    //intercept сделать по типу middleware
                    if (intercept) return intercept(requestArgs).then(requestCreator);

                    else return requestCreator(requestArgs);
                })
                .catch(function (error) {
                    //Если кто-то внутри уже выкинул это исключение (убрать данный эксепшн на уровень интерсепта куда нить. чтобы никогда нигде не проверять error.status)
                    if (error.status == 0) throw new noInternetException(error);
                    throw error;
                });
        });
    }
}