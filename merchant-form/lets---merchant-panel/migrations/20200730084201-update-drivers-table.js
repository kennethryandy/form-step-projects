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
  db.addColumn('drivers', 'email', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'reference_name', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'reference_phone_number', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'date_time_to_call', { type: 'timestamp'}, callback);
  db.addColumn('drivers', 'city_province_town', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'country', { type: 'string', length: 255 }, callback);
  db.addColumn('drivers', 'bir_tin', { type: 'string', length: 255 }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
