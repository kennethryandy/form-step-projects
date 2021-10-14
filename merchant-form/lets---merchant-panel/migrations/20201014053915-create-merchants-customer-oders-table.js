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
  db.createTable('merchants_customer_orders', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: 'int'
    },
    customer_id: {
      type: 'int'
    },
    customer_name: {
      type: 'string',
      length: 499,
    },
    order_amount: {
      type: 'decimal(12,2)'
    },
    status: {
      type: 'string'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('merchants_customer_orders', callback);
};

exports._meta = {
  "version": 1
};
