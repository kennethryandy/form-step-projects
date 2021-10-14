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
  db.changeColumn('messages', 'driver_id', {
    type: 'string',
    length: 299
  }, callback);
  db.changeColumn('messages', 'passenger_id', {
    type: 'string',
    length: 299
  }, callback);
  // db.renameColumn('messages', 'driver_id', 'driver_phone_number', callback);
  // db.renameColumn('messages', 'passenger_id', 'passenger_phone_number', callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
