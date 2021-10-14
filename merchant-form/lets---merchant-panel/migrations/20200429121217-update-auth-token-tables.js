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
  db.addColumn('passengers_auth_token', 'expiry_date', { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP')}, callback);
  db.addColumn('drivers_auth_token', 'expiry_date', { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP')}, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('passengers_auth_token', 'expiry_date', callback);
  db.removeColumn('drivers_auth_token', 'expiry_date', callback);
};

exports._meta = {
  "version": 1
};
