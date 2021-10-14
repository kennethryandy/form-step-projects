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
  db.removeColumn('passengers_facebook', 'birthday', callback);
  db.addColumn('passengers_facebook', 'fb_first_name', { type: 'string', length: 255 }, callback);
  db.addColumn('passengers_facebook', 'fb_last_name', { type: 'string', length: 255 }, callback);
  db.addColumn('passengers_facebook', 'fb_email', { type: 'string', length: 255 }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
