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
  db.addColumn('driver_locations', 'is_latest', { type: 'boolean', defaultValue: true }, callback);
};

exports.down = function(db, callback) {
  db.deleteColumn('is_latest', callback);
};

exports._meta = {
  "version": 1
};
