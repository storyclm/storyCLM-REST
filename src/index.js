import { AccessTokenManager } from "accessTokenManager";
import { AuthorizationHttpClient } from "authorizationHttpClient";

import { TableClient } from "tableClient";
import { QueryManager } from "queryManager";

export let StoryCLM = {
    REST: {
        Http: {
            AccessTokenManager: AccessTokenManager,
            AuthorizationHttpClient: AuthorizationHttpClient
        },
        Tables: {
            TableClient: TableClient,
            QueryManager: QueryManager
        }
    }
    //OAuth: require('./oauth'),
    //DataService: require('./data-service')
};
