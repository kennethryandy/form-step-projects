'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.addColumn('merchants_promos', 'count', { type: 'int' }, callback);
  db.addColumn('merchants_promos', 'amount', { type: 'decimal(12,2)' }, callback);
  db.addColumn('merchants_promos', 'promo_amount', { type: 'decimal(12,2)' }, callback);
  db.addColumn('merchants_promos', 'usage', { type: 'int' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
