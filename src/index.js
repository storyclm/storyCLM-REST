import {AccessTokenManager} from "accessTokenManager";
import {authorizationHttpClient} from "authorizationHttpClient";
import {TableClient} from "tableClient"
import {QueryManager} from "queryManager"
import {$} from "jquery"
(function() {
        let tokenManager = new AccessTokenManager("client_55_1", "58621818d7ef47cc99aaf547e2ac5b14507a5f566b834592a32bda9984ab7c80");
        let httpclient = authorizationHttpClient(tokenManager);
        let tableClient = new TableClient(125, httpclient);
        let query = QueryManager.create(tableClient).Take(12)
            .ToArray().then(result=>console.dir(result));

    })();