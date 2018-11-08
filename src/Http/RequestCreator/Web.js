import $ from "jquery";
let requestCreator = function requestCreator(requestArgs) {
    let method = requestArgs.method,
        url = requestArgs.url,
        body = requestArgs.stringbody,
        headers = requestArgs.headers;

    let ajaxArgs = {
        method: method.toUpperCase(),
        url: url,
        headers: headers
    };

    if (body) ajaxArgs.data = body;
    return new Promise(function (resolve, reject) {
        $.ajax(ajaxArgs)
            .done(function (message) {
                    return resolve(message);
                }
            )
            .fail(function (message) {
                return reject(message);
            });
    });
};
export default requestCreator;