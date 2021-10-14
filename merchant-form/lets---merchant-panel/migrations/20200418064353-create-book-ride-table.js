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
  db.createTable('book_ride', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    calculated_ride_id: {
      type: 'int',
    },
    passenger_phone_number: {
      type: 'string',
      length: 15
    },
    driver_phone_number: {
      type: 'string',
      length: 15,
      notNull: false
    },
    status: {
      type: 'string',
      length: 255
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('book_ride', callback);
};

exports._meta = {
  "version": 1
};
