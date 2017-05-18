/*!
* storyCLient Library v0.0.1
* Copyright(c) 2017, Vladimir Klyuev, Breffi Inc. All rights reserved.
* License: Licensed under The MIT License.
*/
var base64Convert = (function () {
    function UTF8toB64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    function b64toUTF8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    return {
        b64toUTF8: b64toUTF8,
        UTF8toB64: UTF8toB64
    }
}());

;
var storyCLient = function (clientId, key) {
    if (this instanceof storyCLient) {
        var self = this;
        self.auth.clientId = clientId;
        self.auth.key = key;
    } else {
        return new storyCLient(data);
    }
}

storyCLient.prototype = {

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

    encodeText: function (text) {
        text = text || "";
        return base64Convert.UTF8toB64(text);
    },

    encodeJson: function (entry) {
        entry = entry || {};
        return base64Convert.UTF8toB64(JSON.stringify(entry, null, 4));
    },

    decodeText: function (text) {
        return base64Convert.b64toUTF8(text);
    },

    decodeJson: function (text) {
        return JSON.parse(base64Convert.b64toUTF8(text));
    },

    checkResponse: function (message) {
        if (!(message.errorCode == 200 || message.errorCode == 201)) alert(message.errorMessage);
    },

    throwArgumentException: function (mess) {
        throw "Argument Exception: " + mess;
    },

    getHeaders: function (isJson) {
        let self = this;
        let headers = {
            "Accept": "application/json",
            "Accept-Language": "en-us,en;q=0.5",
            "Accept-Charset": "utf-8"
        };
        if (isJson) {
            headers["Content-Type"] = "application/json";
        }
        if (self.auth.isAuth) {
            headers["Authorization"] = "Bearer " + self.auth.token;
        }
        return headers;
    },

    auth: function (handler) {
        let self = this;
        let body = self.encodeText("grant_type=client_credentials&client_id=" + self.auth.clientId + "&client_secret=" + self.auth.key);
        let url = self.endpoints.auth + self.parts.token;
        let headers = {
            "Accept": "application/json",
            "Accept-Language": "en-us,en;q=0.5",
            "Accept-Charset": "utf-8",
            "Content-Type": "application/x-www-form-urlencoded"
        };
        StoryCLM.Http.Post(url, body, headers, function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            self.auth.token = result.access_token;
            self.auth.isAuth = true;
            if (typeof handler === "function") handler(result);
        });
    },

    count: function (tableId, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        let url = self.endpoints.api + self.parts.tables + tableId + `/count`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    countByQuery: function (tableId, tablesQuery, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof tablesQuery === "undefined") self.throwArgumentException("tablesQuery");
        let query = self.encodeText(tablesQuery);
        let url = self.endpoints.api + self.parts.tables + tableId + `/countbyquery/${query}`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            $("#response").html("<pre>" + JSON.stringify(message, null, 4) + "</pre>");
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    findAll: function (tableId, skip, take, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof skip !== "number") self.throwArgumentException("skip");
        if (typeof take !== "number") self.throwArgumentException("take");
        let url = self.endpoints.api + self.parts.tables + tableId + `/findall/${skip}/${take}`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    find: function (tableId, tablesQuery, skip, take, sortField, sort, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof tablesQuery === "undefined") self.throwArgumentException("tablesQuery");
        if (typeof sortField === "undefined") self.throwArgumentException("sortField");
        if (typeof skip !== "number") self.throwArgumentException("skip");
        if (typeof take !== "number") self.throwArgumentException("take");
        if (typeof sort !== "number") self.throwArgumentException("sort");
        alert("ХУЙ");
        let url = self.endpoints.api + self.parts.tables + tableId + `/find/${tablesQuery}/${sortField}/${sort}/${skip}/${take}`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    findById: function (tableId, id, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof id === "undefined") self.throwArgumentException("id");
        if (Array.isArray(id)) self.throwArgumentException("id");
        let url = self.endpoints.api + self.parts.tables + tableId + `/findbyid/${id}`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    idsToString(ids) {
        if (!Array.isArray(ids)) "";
        let result = "";
        ids.forEach((id) => {
            result += `ids=${id}&`;
        });
        return result.slice(0, -1);
    },

    findByIds: function (tableId, ids, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof ids === "undefined") self.throwArgumentException("ids");
        if (!Array.isArray(ids)) self.throwArgumentException("ids");
        let url = self.endpoints.api + self.parts.tables + tableId + `/findbyids?${self.idsToString(ids)}`;
        StoryCLM.Http.Get(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    delete: function (tableId, id, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof id === "undefined") self.throwArgumentException("id");
        if (Array.isArray(id)) self.throwArgumentException("id");
        let url = self.endpoints.api + self.parts.tables + tableId + `/delete/${id}`;
        StoryCLM.Http.Delete(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    deleteMany: function (tableId, ids, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof ids === "undefined") self.throwArgumentException("ids");
        if (!Array.isArray(ids)) self.throwArgumentException("ids");
        let url = self.endpoints.api + self.parts.tables + tableId + `/deletemany?${self.idsToString(ids)}`;
        StoryCLM.Http.Delete(url, self.getHeaders(false), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

    insert: function (tableId, entry, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof entry === "undefined") self.throwArgumentException("entry");
        if (Array.isArray(entry)) self.throwArgumentException("entry");
        let url = self.endpoints.api + self.parts.tables + tableId + "/insert";
        StoryCLM.Http.Post(url, self.encodeJson(entry), self.getHeaders(true), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

     insertMany: function (tableId, entries, handler) {
        let self = this;
        if (typeof tableId !== "number") self.throwArgumentException("tableId");
        if (typeof entries === "undefined") self.throwArgumentException("entries");
        if (!Array.isArray(entries)) self.throwArgumentException("entries");
        let url = self.endpoints.api + self.parts.tables + tableId + "/insertMany";
        StoryCLM.Http.Post(url, self.encodeJson(entries), self.getHeaders(true), function (message) {
            self.checkResponse(message);
            let result = self.decodeJson(message.data.body);
            if (typeof handler === "function") handler(result);
        });
    },

     update: function (tableId, entry, handler) {
         let self = this;
         if (typeof tableId !== "number") self.throwArgumentException("tableId");
         if (typeof entry === "undefined") self.throwArgumentException("entry");
         if (Array.isArray(entry)) self.throwArgumentException("entry");
         let url = self.endpoints.api + self.parts.tables + tableId + "/update";
         StoryCLM.Http.Put(url, self.encodeJson(entry), self.getHeaders(true), function (message) {
             self.checkResponse(message);
             let result = self.decodeJson(message.data.body);
             if (typeof handler === "function") handler(result);
         });
     },

     updateMany: function (tableId, entries, handler) {
         let self = this;
         if (typeof tableId !== "number") self.throwArgumentException("tableId");
         if (typeof entries === "undefined") self.throwArgumentException("entries");
         if (!Array.isArray(entries)) self.throwArgumentException("entries");
         let url = self.endpoints.api + self.parts.tables + tableId + "/updateMany";
         StoryCLM.Http.Put(url, self.encodeJson(entries), self.getHeaders(true), function (message) {
             self.checkResponse(message);
             let result = self.decodeJson(message.data.body);
             if (typeof handler === "function") handler(result);
         });
     },

}