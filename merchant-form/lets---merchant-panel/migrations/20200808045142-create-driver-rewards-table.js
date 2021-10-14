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
  db.createTable('driver_rewards', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    driver_phone_number: {
      type: 'string',
      length: 11,
      notNull: true
    },
    amount: {
      type: 'decimal(12,2)',
      notNull: true
    },
    minimum_rides: {
      type: 'int',
      notNull: true
    },
    active_time_from: {
      type: 'timestamp',
      notNull: true
    },
    active_time_until: {
      type: 'timestamp',
      notNull: true
    },
    expiration_date: {
      type: 'timestamp',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('driver_rewards', callback);
};

exports._meta = {
  "version": 1
};
