const Boom = require('boom');
const bcrypt = require('bcrypt');

const {
    database
} = rootRequire('config');
const saltRounds = 10;

/**
 * Notice in the example below no releaseCallback was necessary.
 * The pool is doing the acquiring and releasing internally.
 * I find pool.query to be a handy shortcut in a lot of situations.
 * Do not use pool.query if you need transactional integrity:
 * the pool will dispatch every query passed to pool.query on the first available idle client.
 * Transactions within PostgreSQL are scoped to a single client.
 * so dispatching individual queries within a single transaction across
 * multiple, random clients will cause big problems in your app and not work.
 */
/**
 * @param  {string} text
 * @param  {array} params
 */
function query(text, params) {
    return database.query(text, params);
}

/** Use this for transactional integrity */
function getClient() {
    return database.connect();
}

function insert({
    client,
    tableName,
    data,
    returnClause
}) {
    let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(data)})
                  VALUES(${getCommaSeparatedParamSubtitute(data)})`;
    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    const values = getObjectValues(data);
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, values);
    /** If client is not provide then use client from connection pool */
    return query(text, values);
}

function bulkInsert({
    client,
    tableName,
    data,
    returnClause
}) {
    if (data.constructor !== Array && data.length === 0) {
        throw Boom.badRequest('Please provide array of values for bulk insert operation');
    }
    let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(data[0])}) VALUES`;
    const values = [];
    const paramsClause = data.map((element, index) => {
        const size = ((Object.keys(element).length) * index) + 1;
        Array.prototype.push.apply(values, getObjectValues(element));
        return `(${getCommaSeparatedParamSubtitute(element, size)})`;
    }).join(', ');
    text = `${text} ${paramsClause}`;
    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, values);
    /** If client is not provide then use client from connection pool */
    return query(text, values);
}

function bulkUpsert({
    client,
    tableName,
    insertData,
    updateData,
    indexColumns,
    conflictClause,
    returnClause
}) {
    if (insertData.constructor !== Array && insertData.length === 0) {
        throw Boom.badRequest('Please provide array of values for bulk insert operation');
    }
    if (indexColumns.constructor !== Array && indexColumns.length === 0) {
        throw Boom.badRequest('Please provide array of index columns for upsert operation');
    }
    let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(insertData[0])}) VALUES`;
    const values = [];
    const paramsClause = insertData.map((element, index) => {
        const size = ((Object.keys(element).length) * index) + 1;
        Array.prototype.push.apply(values, getObjectValues(element));
        return `(${getCommaSeparatedParamSubtitute(element, size)})`;
    }).join(', ');
    text = `${text} ${paramsClause}`;
    /** Update clause for Bulk Upsert Operation */
    const updateClause = Object.keys(updateData).map((key) => {
        const pair = `${key} = excluded.${key}`;
        return pair;
    }).join(',');

    text = `${text} ON CONFLICT(${indexColumns.join(',')})`;
    text = `${text} DO`;

    if (conflictClause && conflictClause.toUpperCase() === 'UPDATE') {
        text = `${text}  UPDATE SET ${updateClause}`;
    } else {
        text = `${text} NOTHING`;
    }

    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, values);
    /** If client is not provide then use client from connection pool */
    return query(text, values);
}

function update({
    client,
    tableName,
    data,
    whereClause,
    returnClause
}) {
    /** Enriching the update clause params */
    const values = getObjectValues(data);
    Array.prototype.push.apply(values, whereClause.values);
    /** Enriching the update clause */
    let text = `UPDATE ${tableName} SET ${getUpdateSetClause(data)} ${whereClause.text}`;
    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, values);
    /** If client is not provide then use client from connection pool */
    return query(text, values);
}

function upsert({
    client,
    tableName,
    insertData,
    updateData,
    indexColumns,
    conflictClause,
    returnClause
}) {
    if (indexColumns.constructor !== Array && indexColumns.length === 0) {
        throw Boom.badRequest('Please provide array of index columns for upsert operation');
    }
    let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(insertData)})
    VALUES(${getCommaSeparatedParamSubtitute(insertData)})`;

    const values = getObjectValues(insertData);
    const counter = values.length;

    Array.prototype.push.apply(values, getObjectValues(updateData));

    text = `${text} ON CONFLICT(${indexColumns.join(',')})`;
    text = `${text} DO`;
    if (conflictClause && conflictClause.toUpperCase() === 'UPDATE') {
        text = `${text}  UPDATE SET ${getUpdateSetClause(updateData, counter + 1)}`;
    } else {
        text = `${text} NOTHING`;
    }
    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, values);
    /** If client is not provide then use client from connection pool */
    return query(text, values);
}

/** Cannot name delete since it's a keyword in javascript */
function pgDelete({
    client,
    tableName,
    whereClause,
    returnClause
}) {
    if (!(whereClause && typeof whereClause === 'object' && Object.keys(whereClause).length > 0)) {
        throw Boom.badRequest('Please provide valid where clause for delete operation');
    }
    let text = `DELETE FROM ${tableName}`;
    text = `${text} ${whereClause.text}`;
    if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
        text = `${text} RETURNING ${returnClause.join(',')}`;
    }
    /** If client is provided in argument then use client for atomicity */
    if (client) return client.query(text, whereClause.values);
    /** If client is not provide then use client from connection pool */
    return query(text, whereClause.values);
}

// function query(query) {
//     return new Promise((resolve, reject) => {
//         // console.log(database);

//         (async () => {
//             const client = await database.connect()
//             try {
//                 const res = await client.query(query)
//                 resolve(res.rows)

//                 console.log(res.rows[0])
//             } finally {
//                 client.release()
//             }
//         })().catch(e => console.log(e.stack))
//         // if (database.readyForQuery == true) {

//         //     database.query(query)
//         //         .then(result => {
//         //             resolve(result.rows)
//         //         })
//         //         .catch(e => reject(e.stack))
//         //         .then(() => database.end())


//         // } else {
//         // database.connect()
//         //     .then(() => {
//         //         database.query(query)
//         //             .then(result => {
//         //                 resolve(result.rows)
//         //             })
//         //             .catch(e => reject(e.stack))
//         //             .then(() => database.end())
//         //     })
//         //     .catch(e => console.error('connection error', e.stack))
//         // }

//     });
// }

// function paramQuery(query, values) {
//     return new Promise((resolve, reject) => {

//         (async () => {
//             const client = await database.connect()
//             try {
//                 const res = await client.query(query, values)
//                 console.log(res.rows[0])
//                 resolve(res.rows)

//             } finally {
//                 client.release()
//             }
//         })().catch(e => console.log(e.stack))

//         // if (database.readyForQuery == true) {

//         //     database.query(query, values)
//         //         .then(result => {
//         //             resolve(result.rows)
//         //         })
//         //         .catch(e => reject(e.stack))
//         //         // .then(() => database.end())

//         // } else {

//         //     database.connect()
//         //         .then(() => {
//         //             database.query(query, values)
//         //                 .then(result => {
//         //                     resolve(result.rows)
//         //                 })
//         //                 .catch(e => reject(e.stack))
//         //                 // .then(() => database.end())
//         //         })
//         //         .catch(e => console.error('connection error', e.stack))

//         // }

//     });

// }


function encryptPassword(pass) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(pass, salt, function (err, hash) {
                resolve(hash)
            });
        });
    });
}

function decryptComparePassword(pass, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, function (err, res) {
            resolve(res)
        });
    });
}


module.exports = {
    database,
    query,
    getClient,
    insert,
    bulkInsert,
    bulkUpsert,
    update,
    upsert,
    pgDelete,
    //  query,
    //  paramQuery,
    decryptComparePassword,
    encryptPassword

};