function findOne({ baseQuery, selectQuery, populateQuery, limitQuery, sortQuery, skipQuery }) {
  return this.Model
    .findOne(baseQuery)
    .select(selectQuery || {})
    .sort(sortQuery || {})
    .skip(Number(skipQuery) || 0)
    .limit(Number(limitQuery) || 0)
    .populate(populateQuery || '')
    .exec();
}

function findById(id, projection) {
  return this.Model.findById(id, projection).exec();
}

function findByIdAndUpdate(id, updateObj) {
  return this.Model.findByIdAndUpdate(id, updateObj, { new: true }).exec();
}

function save(doc) {
  // doc.client = this.clientId;
  const document = new this.Model(doc);
  return document.save();
}

function find({ baseQuery, selectQuery, populateQuery, limitQuery, sortQuery, skipQuery }) {
  return this.Model
    .find(baseQuery)
    .select(selectQuery || {})
    .sort(sortQuery || {})
    .skip(Number(skipQuery) || 0)
    .limit(Number(limitQuery) || 0)
    .populate(populateQuery || '')
    .exec();
}

function findByPagination({ baseQuery, totalCountQuery, populateQuery }, filter) {
  return this.Model
    .find(baseQuery)
    .select(filter.select)
    .sort(filter.sort)
    .skip(filter.skip)
    .limit(filter.limit)
    .populate(populateQuery || '')
    .exec()
    .then((response) => {
      return Promise.all([this.Model.count(totalCountQuery), this.Model.count(baseQuery)])
        .then((count) => {
          const recordsTotal = count[0];
          const recordsFiltered = count[1];
          const draw = filter.draw;
          return { recordsTotal, recordsFiltered, draw, response };
        });
    });
}

function update(query, updateObject, options) {
  // query.client = this.clientId;
  return this.Model.update(query, updateObject, options).exec();
}

function count(query) {
  // query.client = this.clientId;
  return this.Model.count(query).exec();
}

function remove(query) {
  return this.Model.remove(query);
}

function findOneAndRemove(query) {
  return this.Model.findOneAndRemove(query);
}

function findByIdAndRemove(id) {
  return this.Model.findByIdAndRemove(id);
}

// Finally Returning Model instance for custom queries
function getModel() {
  return this.Model;
}

function batchInsert(batch, options) {
  return this.Model.collection.insert(batch, options);
}

// Constructor function
function DAO() {
  // assert.ok(model);
  // this.Model = model;
}

DAO.prototype = {
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndRemove,
  findByPagination,
  findOne,
  findOneAndRemove,
  remove,
  update,
  count,
  save,
  getModel,
  batchInsert,
};

module.exports = DAO;