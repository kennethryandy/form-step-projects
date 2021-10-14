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
  db.addColumn('driver_locations', 'status', { type: 'string',  length: 25}, callback);
};

exports.down = function(db, callback) {
  db.deleteColumn('status', callback);
};

exports._meta = {
  "version": 1
};
