import {TableQuery} from "tableQuery";
import {
    filterArrayObj,
    emptyFilterException,
    querySatisfaction,
    buildJoinedQuery} from "./queryUtils";

export let QueryManager = function (query) {
    this.query = query;
}

QueryManager.prototype._nextQuery = function (nextQuery) {
    var query = new TableQuery(this.query, nextQuery);
    return new QueryManager(query);
}

QueryManager.prototype.Skip = function (skip) {
    return this._nextQuery({ skip: skip });
}
QueryManager.prototype.Take = function (take) {
    return this._nextQuery({ take: take });
}

QueryManager.prototype.SortBy = function (fieldName, asc) {
    return this._nextQuery({ sortBy: fieldName, asc: asc });
}

QueryManager.prototype.Where = function (queryObj) {
    return this._nextQuery({ queryObj: queryObj });
}

QueryManager.prototype.SetPrevQuery = function (preQuery) {
    return this._nextQuery({ preQuery: preQuery });
}

QueryManager.prototype.then = function (thenCallBack) {
    return this._nextQuery({ thenCallBack: thenCallBack });
}

//по сути джойнит два запроса по joinBy условию. Результат записывается в поле relationName
//includeO2M.relationTableQuery - запрос с которым происходит слияние
//includeO2M.joinBy - условия слияния
//includeO2M.relationName - свойство изначальных объектов, куда записывается результат
QueryManager.prototype.IncludeO2M = function (includeO2M) {
    var self = this;
    return this
        .then(function (result) {
            var qObj = {};
            for (propname in includeO2M.joinBy)
                qObj[propname] = result.map(function (q) {
                    return q[includeO2M.joinBy[propname]];
                });
            return includeO2M.relationTableQuery
                .Where(qObj)
                .ToArray()
                .then(function (relationResult) {
                    result.forEach(function (r) {
                        r[includeO2M.relationName] = relationResult.filter(function (rr) {
                            for (propname in includeO2M.joinBy)
                                if (rr[propname] != r[includeO2M.joinBy[propname]]) return false;
                            return true;
                        })
                    })
                    return result;
                });
        });
}

//включить в запрос связи многие ко многим (выполняется как постдействие после основного запроса)
QueryManager.prototype.IncludeM2M = function (includeM2M) {
    return this.IncludeO2M({
        relationName: includeM2M.relationName,
        joinBy: includeM2M.middleJoinBy,
        relationTableQuery: includeM2M.middleTableQuery
            .IncludeO2M({
                relationName: "$tempName",
                joinBy: includeM2M.finalJoinBy,
                relationTableQuery: includeM2M.finalTableQuery
            })
            .then(function (result) {

            })
    })
        .then(function (result) {
            result.forEach(function (r) {
                //flattinig array of arrays
                r[includeM2M.relationName] = [].concat.apply([], r[includeM2M.relationName].map(function (rr) { return rr["$tempName"] }));
            })
        });
}

QueryManager.prototype.ToArray = function (forceRefresh) {
    var self = this;
    //self.queryPromise кэш для запроса
    if (!self.queryPromise || forceRefresh || self.queryPromise.rejected)
        self.queryPromise = buildJoinedQuery(self.query)//кэш
            .then(function (totalQuery) {

                //Изза того что апи не дает использовать фильтр по идентификаторам с остальными фильтрами, приходится городить следующий огород с локальной фильтрацией
                //Проверяем не затесался ли  унас фильтр по id - если так - специальная обработка
                //Костыль - если вместе с идентификаторами в одном queryObject будет заданы другие фильтры они будут игнорирорваться!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                var queryById = totalQuery.filter(function (el) {
                    return el._id || el.Id;
                });

                if (queryById.length > 0) {
                    var ids = queryById
                        .map(function (q) {
                            return q._id || q.Id;
                        })
                        .map(function (el) {
                            return (Array.isArray(el)) ? el : [el];
                        });

                    ids = ids.reduce(function (prevArray, currentArray) { //пересечение всех идентификаторов
                        return intersect(prevArray, currentArray);
                    });

                    //Запрашиваем данные по идентификаторам и потом на месте фильтруем по остальным фильтрам

                    return self.query.tableClient.findByIds(ids)
                        .then(function (items) {
                            return items.filter(function (item) {
                                return querySatisfaction(totalQuery, item);
                            });
                        });
                }
                else
                    try {
                        return self.query.tableClient.find(filterArrayObj(totalQuery), self.query.skip, self.query.take, self.query.sortBy, self.query.asc);
                    }
                    catch (ex) {
                        if (ex instanceof emptyFilterException) return Promise.resolve([]);
                        throw ex;
                    }
            })
            .then(function (result) { //async callbacks
                //execute promises sequantly
                return self.query.thenCallBack.reduce(function (prevPromise, currentPromiseCreator) {
                    return prevPromise.then(function () {
                        return currentPromiseCreator(result);
                    });
                }, Promise.resolve())
                    .then(function () {
                        return result;
                    });
            })
            .catch(function (error) {
                self.queryPromise.rejected = true;
                throw error;
            });

    return self.queryPromise;
}

QueryManager.prototype.Count = function () {
    var self = this;
    return buildJoinedQuery(self.query)
        .then(function (totalQuery) {
        //Если в запросе есть идентификаторы выкачиваем все данные и отдаем их длину - костыль из-за отсуствия возможности фильтрации при запросе по id !!!!!!!!!!!!!!!!!!!!!!
        if (totalQuery.some(function (el) {
            return el._id || el.Id;
        }))
            return self.ToArray().then(function (items) {
                return items.length;
            });
        else
            try {
                return self.query.tableClient.count(filterArrayObj(totalQuery));
            }
            catch (ex) {
                if (ex instanceof emptyFilterException) return Promise.resolve([]);
            }
    })
        .then(function (count) {
            return Math.min(count, self.query.take || Infinity);
        });
};

QueryManager.create = function (tableClient) {
    return new QueryManager({tableClient:tableClient});
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function intersect(array1, array2) {
    return array1.filter(function (value) { return -1 !== array2.indexOf(value) });
}

