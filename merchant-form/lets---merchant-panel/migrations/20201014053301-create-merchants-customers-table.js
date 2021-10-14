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
  db.createTable('merchants_customers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: 'int'
    },
    customer_name: {
      type: 'string',
      length: 499,
    },
    phone_number: {
      type: 'string',
      length: 11
    },
    city: {
      type: 'string',
      length: 499,
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
  db.dropTable('merchants_customers', callback);
};

exports._meta = {
  "version": 1
};
