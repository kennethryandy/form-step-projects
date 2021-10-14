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
  db.addColumn('drivers', 'personal_info_status', { type: 'string', length: 255, defaultValue: "filled" }, callback);
  db.addColumn('drivers', 'government_id_status', { type: 'string', length: 255, defaultValue: "filled" }, callback);
  db.addColumn('drivers', 'vehicle_info_status', { type: 'string', length: 255, defaultValue: "filled" }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
