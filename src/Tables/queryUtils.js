import {regexpValue} from "./regexpValue";
import {$} from "jquery"
let filterArrayObj = function (filterObj) {
    return filterObj.map(function (obj) {
        return filterObj2Query(obj);
    })
        .filter(function (el) {
            return (el || "").trim() != "";
        })
        .join("[and]");
}

let emptyFilterException = function () { }

let filterObj2Query = function (filterObj) {
    var query = "";
    for (var key in filterObj) {
        if (filterObj.hasOwnProperty(key)) {
            var filterValue = filterObj[key];
            if (filterValue == null) continue;
            if (key == "Id" || key == "_id") continue; //Забиваем на идентификаторы в запросе (можно было бы бить эксепшены)

            var ampersand = (query != "") ? "[and]" : "";
            //Check value type
            if (Array.isArray(filterValue)) {
                if (filterValue.length == 0) {
                    throw new emptyFilterException();
                    //   query += ampersand + "[" + key + "][in][]";
                    //   continue;
                }
                if (typeof filterValue[0] == "number")
                    query += ampersand + "[" + key + "][in][" + filterValue.filter(onlyUnique).join(",") + "]";
                else
                    query += ampersand + "[" + key + "][in][\"" + filterValue.filter(onlyUnique).join("\",\"") + "\"]";
                continue;
            }
            if (filterValue instanceof RegExp) {
                var flags = intersect("ximXsUJ".split(""), filterValue.flags.split(""));
                query += ampersand + "[" + key + "][re][(?" + flags.join('') + ")" + filterValue.source + "]";
                continue;
            }
            if (filterValue instanceof regexpValue)
                query += ampersand + "[" + key + "][re][" + filterValue.pattern + "]";
            else
                query += ampersand + "[" + key + "][eq][" + filterValue + "]";
        }
    }
    return (query);
}
///ИСпользование запроса в фильтре с локальными данными, пришешдишими с сервера
let querySatisfaction = function (queryobjs, item) {
    if (queryobjs.length == 0) return true;
    return queryobjs.every(function (filterObj) {
        for (var key in filterObj) {
            if (filterObj.hasOwnProperty(key)) {
                if (key == "Id" || key == "_id") continue;
                if (item[key] == filterObj[key]) continue;
                if (Array.isArray(filterObj[key])) {
                    if (filterObj[key].includes(item[key])) continue;
                }
                return false;
            }
        }
        return true;
    });
}

let buildJoinedQuery = function (query) {
    if ((query.preQueries || []).length) {
        var totalQuery = query.queryObjs.slice();
        return Promise.all(
            query.preQueries
                .map(function (q) {
                    return q.query
                        .ToArray()
                        .then(function (prevObjects) {
                            var joinQuery = q.queryObjCreator(prevObjects);
                            totalQuery.push(joinQuery);
                        });
                }))
            .then(function () {
                return totalQuery;
            });
    }
    else return Promise.resolve(query.queryObjs);
}

export{
    filterArrayObj,
    emptyFilterException,
    querySatisfaction,
    buildJoinedQuery
};