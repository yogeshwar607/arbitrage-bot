
 const schemaName = '"arbitrage".'
const tables = {
    customer:'customer',
}

function getTableName (key) {
    return `${schemaName}${tables[key]}`;
}

module.exports = {
getTableName,
}