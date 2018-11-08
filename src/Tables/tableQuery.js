export let TableQuery = function (baseQuery, query) {
        if (baseQuery) {
            this.tableClient = baseQuery.tableClient; //доступ к таблице - должно быть только одно значение во всей цепочке агрегации (иначе первое)
            this.queryObjs = (baseQuery.queryObjs||[]).slice();
            this.preQueries = (baseQuery.preQueries||[]).slice();
            this.thenCallBack = (baseQuery.thenCallBack||[]).slice();
        }
        else {
            this.tableClient = query.tableClient;
            this.queryObjs = [];
            this.preQueries = [];
            this.thenCallBack = [];
        }

        if (query.queryObj) this.queryObjs.push(query.queryObj);     //при агрегации создается массив queryObjs

        this.skip = query.skip || (baseQuery || {}).skip || 0;    //при агрегации берется последнее указанное значение
        this.take = query.take || (baseQuery || {}).take;      //при агрегации берется последнее указанное значение
        this.sortBy = query.sortBy || (baseQuery || {}).sortBy;      //при агрегации берется последнее указанное значение
        this.asc = query.asc || (baseQuery || {}).asc;      //при агрегации берется последнее указанное значение
        if (query.preQuery) this.preQueries.push(query.preQuery);   //предусловие перед текущим запросом //при агрегации собирается в массив и строится общая коньюнкция условий
        if (query.thenCallBack) this.thenCallBack.push(query.thenCallBack);  // действие после выборки //агреггируется в массив последовательных действий
    }
//query одиночный упрощенный вариант tableQuery. В нем такие же поля за исключением
// query.preQuery,
// query.thenCallBack, которые заменяются массивом

//также в query отсутствует baseQuery


//О query.preQuery
//Представляет собой предазпрос, результаты которого являются частью условия текщуего запроса (некий джойн)
//{
//  query - сам предзапрос (на самом деле является объектом queryManager с кэшем и прочими приблудами - хотя хотелось бы плоский объект)
//  queryObjCreator - на основе результатов query создает дополнительные условия, которые затем добавляются в queryObjs текущего запроса (коньюнкцией)
//}
