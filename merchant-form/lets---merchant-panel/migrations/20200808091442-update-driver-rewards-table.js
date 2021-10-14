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
  db.changeColumn('driver_rewards', 'active_time_from', {
    type: 'time'
  }, callback);
  db.changeColumn('driver_rewards', 'active_time_until', {
    type: 'time'
  }, callback);
  db.changeColumn('driver_rewards', 'expiration_date', {
    type: 'date'
  }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
