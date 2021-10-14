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
  db.addColumn('payments', 'phone_number', { type: 'string', length: 11 }, callback);
  db.addColumn('payments', 'is_approved', { type: 'boolean', defaultValue: false }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
