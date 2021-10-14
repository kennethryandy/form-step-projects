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
  db.createTable('merchants', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: 'string',
      length: 255,
      unique: true,
      notNull: true
    },
    email: {
      type: 'string',
      length: 255,
      unique: true,
      notNull: true
    },
    password: {
      type: 'string',
      length: 999,
      notNull: true
    },
    store_name: {
      type: 'string',
      length: 499
    },
    store_hours_start: {
      type: 'time'
    },
    store_hours_end: {
      type: 'time'
    },
    phone_number: {
      type: 'string',
      length: 11
    },
    landline_number: {
      type: 'string',
      length: 20
    },
    location_full_address: {
      type: 'string',
      length: 999
    },
    store_description: {
      type: 'string',
      length: 999
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('merchants', callback);
};

exports._meta = {
  "version": 1
};
