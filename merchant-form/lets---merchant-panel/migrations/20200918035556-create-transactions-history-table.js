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
  db.createTable('transactions_history', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: 'string',
      length: 499,
      notNull: true
    },
    amount: {
      type: 'decimal(12,2)',
      notNull: true
    },
    source: {
      type: 'string',
      length: 499
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('transactions_history', callback);
};

exports._meta = {
  "version": 1
};
