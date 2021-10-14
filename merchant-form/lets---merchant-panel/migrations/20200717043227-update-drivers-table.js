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
  db.removeColumn('drivers', 'image_url', callback);
  db.addColumn('drivers', 'file_nbi_police', { type: 'string', length: 599 }, callback);
  db.addColumn('drivers', 'file_lto_registration', { type: 'string', length: 599 }, callback);
  db.addColumn('drivers', 'file_registration_orcr', { type: 'string', length: 599 }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
