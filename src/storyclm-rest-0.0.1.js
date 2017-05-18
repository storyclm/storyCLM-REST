/*!
* StoryCLM-REST Library v0.0.1
* Copyright(c) 2017, Vladimir Klyuev, Breffi Inc. All rights reserved.
* License: Licensed under The MIT License.
*/
var storyCLMREST = function (clientId, key) {
    if (this instanceof storyCLMREST) {
        var self = this;
        self.auth.clientId = clientId;
        self.auth.key = key;
    } else {
        return new storyCLMREST(data);
    }
}

storyCLMREST.prototype = {

    auth: {
        clientId: "",
        key: "",
        token: "",
        isAuth: false
    },

    endpoints: {
        api: "https://api.storyclm.com/v1/",
        auth: "https://auth.storyclm.com/"
    },

    parts: {
        token: "connect/token",
        tables: "tables/"
    },

    auth: function () {
        var self = this;
        
    }
}
