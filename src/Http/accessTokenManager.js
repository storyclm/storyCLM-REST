import {HttpClient} from "./httpClient";
let  AccessTokenManager = function (clientId, clientSecret) {
    var self = this;
    let httpClient = new HttpClient();
    var _authEntity = {
        clientId: clientId,
        key: clientSecret,
        access_token: null,
        expires_date: null,
        token_type: "Bearer"
    };

    var endpoint = "https://auth.storyclm.com/connect/token";

    var authExpired = function () {
        return (_authEntity.access_token == null || (_authEntity.expires_date != null) && _authEntity.expires_date <= new Date());
    };

    this.getCheckedAuth = function (forceRefresh) {
        if (forceRefresh || authExpired())
            return login()
                .then(function (authEntity) {
                    _authEntity.access_token = authEntity.access_token;
                    var currentDate = new Date();
                    _authEntity.expires_date = currentDate.setSeconds(currentDate.getSeconds() + authEntity.expires_in);
                    if (_onAuthUpdated) _onAuthUpdated(_authEntity);
                    return _authEntity;
                });
        else
            return Promise.resolve(_authEntity);
    };

    var login = function () {
        var entity = {
            grant_type: "client_credentials",
            client_id: _authEntity.clientId,
            client_secret: _authEntity.key
        };
        return httpClient.PostForm(endpoint, entity);
    };

    var _onAuthUpdated = null;
    this.onAuthUpdated = function (callback) {
        _onAuthUpdated = callback;
        return this;
    };

    this.setAuth = function (authEntity) {
        _authEntity.access_token = authEntity.access_token;
        _authEntity.expires_date = authEntity.expires_date;
        return this;
    }


}
export {AccessTokenManager}
