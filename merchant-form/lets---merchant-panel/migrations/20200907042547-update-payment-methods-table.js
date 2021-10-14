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
  db.addColumn('payment_methods', 'account_name', { type: 'string', length: 499 }, callback);
  db.addColumn('payment_methods', 'account_number', { type: 'string', length: 499 }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
