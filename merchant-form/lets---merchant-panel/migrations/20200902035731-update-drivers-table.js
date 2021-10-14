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
  db.addColumn('drivers', 'gender', { type: 'string', length: 1 }, callback);
  db.addColumn('drivers', 'vehicle_type', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'vehicle_file_id', { type: 'int' }, callback);
  db.addColumn('drivers', 'government_id', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'government_id_file_id', { type: 'int' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
