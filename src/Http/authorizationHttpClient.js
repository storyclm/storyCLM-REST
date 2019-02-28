import {HttpClient} from "./httpClient"
let authorizationHttpClient = function (accessTokenManager, httpClient) {
    httpClient = httpClient || new HttpClient();
    httpClient.setInterceptor(
        function (requestArgs) { //как пример перехватчика
            return accessTokenManager
                .getCheckedAuth()
                .then(function (authEntity) {
                    requestArgs.headers["Authorization"] = authEntity.token_type + " " + authEntity.access_token;
                    return requestArgs;
                })
        });
    httpClient.setAuth(function () {
        return accessTokenManager.getCheckedAuth(true);
    });
    return httpClient;
}
export {authorizationHttpClient}