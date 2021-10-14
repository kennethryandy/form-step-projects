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
  db.addColumn('bank_list', 'account_name', { type: 'string', length: 499, defaultValue: 'My account name' }, callback);
  db.addColumn('bank_list', 'account_number', { type: 'string', length: 499, defaultValue: '123456789' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
