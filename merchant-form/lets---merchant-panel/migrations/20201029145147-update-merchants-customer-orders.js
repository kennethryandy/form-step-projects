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
  db.renameColumn('merchants_customer_orders', 'product_ids', 'product_id', callback);
  db.changeColumn('merchants_customer_orders', 'product_id', {
    type: 'int'
  }, callback);
  db.addColumn('merchants_customer_orders', 'transaction_number', { type: 'string', length: 499 }, callback);
  db.addColumn('merchants_customer_orders', 'quantity', { type: 'int' }, callback);
  db.addColumn('merchants_customer_orders', 'total_order_amount', { type: 'decimal(12,2)' }, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
