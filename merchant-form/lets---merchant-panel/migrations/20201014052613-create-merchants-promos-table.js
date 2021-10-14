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
  db.createTable('merchants_promos', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: 'int'
    },
    promo_code: {
      type: 'string',
      length: 255,
      unique: true,
      notNull: true
    },
    promo: {
      type: 'string',
      length: 499,
    },
    percentage: {
      type: 'decimal(12,2)'
    },
    start_date: {
      type: 'date'
    },
    end_date: {
      type: 'date'
    },
    status: {
      type: 'string',
      defaultValue: 'active'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('merchants_promos', callback);
};

exports._meta = {
  "version": 1
};
