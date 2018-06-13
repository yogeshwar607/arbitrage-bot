const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

function QueryBuilder(config = {}) {
  this.buildTotalQuery = config.buildTotalQuery || false;
  this._columns = null;
  this._mainQuery = [];
  this.mainQuery = '';
  this.mainValues = [];
  this._totalQuery = [];
  this.totalQuery = '';
  this.totalValues = [];
  this.isParameterized = true;
  this._limit = null;
}

QueryBuilder.prototype._appendQuery = function (query, forTotal) {
  const s = query;
  this._mainQuery.push(s);
  if (this.buildTotalQuery && forTotal) {
    this._totalQuery.push(s);
  }
};

QueryBuilder.prototype._appendTotalQuery = function (query) {
  const s = query;
  if (this.buildTotalQuery) {
    this._totalQuery.push(s);
  }
};

QueryBuilder.prototype._computeSkip = function (limit, page) {
  // const _limit = limit || DEFAULT_LIMIT;
  // const _page = page || DEFAULT_PAGE;
  // return (_page - 1) * _limit;
  return page;
};

QueryBuilder.prototype._generateColumns = function (_columns) {
  if (!this._columns) this._columns = _columns;
  if (!_columns || typeof _columns === 'string') return _columns;
  let columns = Object.keys(_columns).map((key) => {
    if (typeof _columns[key] === 'object') {
      return _columns[key].format ? _columns[key].format : `${_columns[key].name} as ${key}`;
    }
    return `${_columns[key]} as ${key}`;
  });
  columns = columns || [];
  return columns.join(',');
};

QueryBuilder.prototype._pushMainParam = function (value) {
  this.mainValues.push(value);
  return `$${this.mainValues.length}`;
};
QueryBuilder.prototype._pushTotalParam = function (value) {
  this.totalValues.push(value);
  return `$${this.totalValues.length}`;
};

QueryBuilder.prototype._distinctOn = function (column) {
  return `DISTINCT ON(${column})`;
};

QueryBuilder.prototype.columns = function (columns) {
  this._columns = columns;
  return this;
};

QueryBuilder.prototype.where = function () {
  this._appendQuery('WHERE 1=1', true);
  return this;
};



QueryBuilder.prototype.having = function () {
  this._appendQuery('HAVING 1=1', true);
  return this;
};

QueryBuilder.prototype.and = function () {
  this._appendQuery(' AND ', true);
  return this;
};
QueryBuilder.prototype.or = function () {
  this._appendQuery(' OR ', true);
  return this;
};
QueryBuilder.prototype.open = function () {
  this._appendQuery(' ( ', true);
  return this;
};
QueryBuilder.prototype.close = function () {
  this._appendQuery(' ) ', true);
  return this;
};
QueryBuilder.prototype.isNull = function (column) {
  this._appendQuery(`${column} IS NULL`, true);
  return this;
};
QueryBuilder.prototype.isNotNull = function (column) {
  this._appendQuery(`${column} NOTNULL`, true);
  return this;
};
QueryBuilder.prototype.is = function (column, value, castAs = '') {
  this._mainQuery.push(`${column}${castAs} = ${this._pushMainParam(value)}${castAs}`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} = ${this._pushTotalParam(value)}${castAs}`);
  return this;
};
QueryBuilder.prototype.isNot = function (column, value, castAs = '') {
  this._mainQuery.push(`${column}${castAs} <> ${this._pushMainParam(value)}${castAs}`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} <> ${this._pushTotalParam(value)}${castAs}`);
  return this;
};
QueryBuilder.prototype.gte = function (column, value, castAs = '') {
  this._mainQuery.push(`${column}${castAs} >= ${this._pushMainParam(value)}${castAs}`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} >= ${this._pushTotalParam(value)}${castAs}`);

  return this;
};
QueryBuilder.prototype.any = function (column, value, castAs = '') {
  if (typeof value === 'string') { value = [value]; }
  this._mainQuery.push(`${column}${castAs} = ANY(${this._pushMainParam(`{${value.join(',')}}`)}${castAs})`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column}${castAs} = ANY(${this._pushTotalParam(`{${value.join(',')}}`)}${castAs})`);
  return this;
};

QueryBuilder.prototype.anyOfArray = function (column, value, castAs = '') {
  this._mainQuery.push(`${value}${castAs} = ANY(${column})`);
  if (this.buildTotalQuery) this._totalQuery.push(`${value}${castAs} = ANY(${column})`);
  return this;
};

QueryBuilder.prototype.lte = function (column, value, castAs = '') {
  this._mainQuery.push(`${column}${castAs} <= ${this._pushMainParam(value)}${castAs}`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} <= ${this._pushTotalParam(value)}${castAs}`);
  return this;
};
QueryBuilder.prototype.not = function (column, value, castAs = '') {
  this._mainQuery.push(`${column}${castAs} <> ${this._pushMainParam(value)}${castAs}`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} <> ${this._pushTotalParam(value)}${castAs}`);
  return this;
};
QueryBuilder.prototype.ilike = function (column, value) {
  this._mainQuery.push(`${column} ilike '%' || ${this._pushMainParam(value)} || '%'`);
  if (this.buildTotalQuery) this._totalQuery.push(`${column} ilike '%' || ${this._pushTotalParam(value)} || '%'`);
  return this;
};

QueryBuilder.prototype.select = function (columns, distinctColumn) {
  if (distinctColumn) this._mainQuery.push(`SELECT ${this._distinctOn(distinctColumn)} ${this._generateColumns(columns)}`);
  else this._mainQuery.push(`SELECT ${this._generateColumns(columns)}`);
  return this;
};

QueryBuilder.prototype.update = function (table) {
  this._mainQuery.push(`UPDATE ${table}`);
  return this;
};

QueryBuilder.prototype.set = function () {
  this._mainQuery.push('SET');
  return this;
};

QueryBuilder.prototype.setField = function (column, value) {
  this._mainQuery.push(`${column}=${this._pushMainParam(value)}`);
  return this;
};

QueryBuilder.prototype.comma = function () {
  this._appendQuery(',');
  return this;
};

QueryBuilder.prototype.returning = function (returning) {
  this._mainQuery.push(`RETURNING ${returning || '*'}`);
  return this;
};

QueryBuilder.prototype.selectTotal = function (col) {
  this._totalQuery.push(`SELECT ${col}`);
  return this;
};

QueryBuilder.prototype.from = function (fromList) {
  this._appendQuery(`FROM ${fromList}`, true);
  return this;
};

QueryBuilder.prototype.leftJoin = function (tables) {
  this._appendQuery(`LEFT JOIN ${tables}`, true);
  return this;
};

QueryBuilder.prototype.rightJoin = function (tables) {
  this._appendQuery(`RIGHT JOIN ${tables}`, true);
  return this;
};

QueryBuilder.prototype.innerJoin = function (tables) {
  this._appendQuery(`INNER JOIN ${tables}`, true);
  return this;
};

QueryBuilder.prototype.outerJoin = function (tables) {
  this._appendQuery(`OUTER JOIN ${tables}`, true);
  return this;
};

QueryBuilder.prototype.groupBy = function (fields) {
  this._appendQuery(`GROUP BY ${fields.join(',')}`, true);
  return this;
};

QueryBuilder.prototype.on = function (on) {
  this._appendQuery(`ON ${on}`, true);
  return this;
};
QueryBuilder.prototype.orderBy = function (column) {
  if (this._columns && this._columns[column]) {
    const _column = this._columns[column];
    column = _column.cast_as ? `${_column.name}::${_column.cast_as}` : column;
  }
  this._mainQuery.push(`ORDER BY ${column}`);
  return this;
};

QueryBuilder.prototype.order = function (order) {
  this._mainQuery.push(`${order || ' desc '}`);
  return this;
};

QueryBuilder.prototype.append = function (customQuery, forTotal = true) {
  this._appendQuery(`${customQuery}`, forTotal);
  return this;
};

QueryBuilder.prototype.appendToTotal = function (customQuery) {
  this._appendTotalQuery(`${customQuery}`);
  return this;
};

QueryBuilder.prototype.limit = function (limit) {
  this._limit = limit || DEFAULT_LIMIT;
  this._mainQuery.push(`LIMIT ${this._pushMainParam(limit)}`);
  return this;
};

QueryBuilder.prototype.page = function (page) {
  this._mainQuery.push(`OFFSET ${this._pushMainParam(this._computeSkip(this._limit, page))}`);
  return this;
};

QueryBuilder.prototype.getMainValues = function () {
  return this.mainValues;
};


QueryBuilder.prototype.getTotalValues = function () {
  return this.mainValues;
};

QueryBuilder.prototype.formatPaginationResponse = function (filteredData, totalRecords) {
  return {
    recordsTotal: totalRecords[0].count || 0,
    recordsFiltered: filteredData.length || 0,
    data: filteredData || [],
  };
};

QueryBuilder.prototype.paginateQuery = async function (pg) {
  this.mainQuery = this._mainQuery.join(' ');
  this.totalQuery = this._totalQuery.join(' ');
  let totalRecords = await pg.query(this.totalQuery, this.totalValues);
  let filteredRecords = await pg.query(this.mainQuery, this.mainValues);
  totalRecords = totalRecords.rows;
  filteredRecords = filteredRecords.rows;
  return this.formatPaginationResponse(filteredRecords, totalRecords);
};

QueryBuilder.prototype.findOne = async function (pg) {
  this.mainQuery = this._mainQuery.join(' ');
  let record = await pg.query(this.mainQuery, this.mainValues);
  record = record.rows;
  if (record.length > 1) {
    throw new Error('Multiple entries found');
  }
  return record && record.length === 1 ? record[0] : null;
};

QueryBuilder.prototype.query = async function (pg) {
  this.mainQuery = this._mainQuery.join(' ');
  const record = await pg.query(this.mainQuery, this.mainValues);
  return record;
};

module.exports =  {
  QueryBuilder,
};