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
  db.removeColumn('drivers', 'file_lto_registration', callback);
  db.removeColumn('drivers', 'is_verified', callback);
  db.addColumn('drivers', 'file_driver_license', { type: 'string', length: 599 }, callback);
  db.addColumn('drivers', 'application_status', { type: 'string', length: 19, defaultValue: 'filled' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
