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

exports.up = function (db, callback) {
  db.createTable('routes_saved', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    passenger_phone_number: {
      type: 'string',
      length: 15
    },
    calculated_ride_id: {
      type: 'int'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('routes_saved', callback);
};

exports._meta = {
  "version": 1
};
