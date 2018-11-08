//httpClient
//{
//    Post
//    PostForm
//    PostJSON
//    Put
//    Get
//    Delete
//};

export let TableClient = function (tableId, httpClient) {
    if (this instanceof TableClient) {
        if (typeof tableId !== "number") throw new Error("tableId must be a number")
        this.tableId = tableId;
        this.httpClient = httpClient;
        this.endpoint = "https://api.storyclm.com/v1/tables/" + this.tableId;
    } else {
        return new TableClient(tableId);
    }
};

TableClient.prototype = {
    throwArgumentException: function (argument) {
        throw new Error("Argument " + argument + " exception");
    },
    url: function (apiMethod) {
        return this.endpoint + "/" + apiMethod;
    },

    count: function (tablesQuery) {
        return this.httpClient
            .Get(
                this.url("count"),
                { query: tablesQuery }
            )
            .then(function (res) {
                return res.count;
            });
    },

    find: function (tablesQuery, skip, take, sortField, asc) {
        return this.httpClient.Get(
            this.url("find"),
            {
                query: tablesQuery,
                skip: skip,
                take: take,
                sortField: sortField,
                sort: sortField?( asc ? 1 : 0):null
            }
        );
    },

    findById: function (id) {
        return this.httpClient.Get(this.url("findbyid") + "/" + id);
    },

    findByIds: function (ids) {
        if (!Array.isArray(ids)) this.throwArgumentException("ids");
        return this.httpClient.Get(
            this.url("findbyids"),
            {
                ids: ids
            }
        );
    },

    delete: function (id) {
        return this.httpClient.Delete(this.url("delete") + "/" + id);
    },

    deleteMany: function (ids) {
        if (!Array.isArray(ids)) this.throwArgumentException("ids");
        return this.httpClient.Delete(
            this.url("deletemany"),
            {
                ids: ids
            }
        );
    },

    insert: function (entry) {
        if (Array.isArray(entry)) this.throwArgumentException("entry");
        return this.httpClient.PostJSON(this.url("insert"), entry);
    },

    insertMany: function (entries) {
        if (!Array.isArray(entries)) this.throwArgumentException("entries");
        return this.httpClient.PostJSON(this.url("insertMany"), entries);
    },

    update: function (entry) {
        if (Array.isArray(entry)) this.throwArgumentException("entry");
        return this.httpClient.Put(this.url("update"), entry);
    },

    updateMany: function (entries) {
        if (!Array.isArray(entries)) this.throwArgumentException("entries");
        return this.httpClient.Put(this.url("updateMany"), entries);
    }

}