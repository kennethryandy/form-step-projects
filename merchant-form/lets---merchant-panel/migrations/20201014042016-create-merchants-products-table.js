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
  db.createTable('merchants_products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: 'int'
    },
    product_code: {
      type: 'string',
      length: 255,
      unique: true,
      notNull: true
    },
    product_name: {
      type: 'string',
      length: 255,
    },
    product_price: {
      type: 'decimal(12,2)',
    },
    product_quantity: {
      type: 'int'
    },
    category: {
      type: 'string',
      length: 255,
    },
    status: {
      type: 'string',
      length: 255,
    },
    image1_id: {
      type: 'int'
    },
    image2_id: {
      type: 'int'
    },
    image3_id: {
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
  db.dropTable('merchants_products', callback);
};

exports._meta = {
  "version": 1
};
