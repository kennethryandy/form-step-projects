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
  db.addColumn('merchants', 'monday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'monday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'tuesday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'tuesday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'wednesday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'wednesday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'thursday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'thursday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'friday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'friday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'saturday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'saturday_store_hours_end', { type: 'time' }, callback);
  db.addColumn('merchants', 'sunday_store_hours_start', { type: 'time' }, callback);
  db.addColumn('merchants', 'sunday_store_hours_end', { type: 'time' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
