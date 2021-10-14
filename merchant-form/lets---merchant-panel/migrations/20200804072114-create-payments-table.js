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
  db.createTable('payments', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    payment_method: {
      type: 'string',
      length: 49
    },
    account_name: {
      type: 'string',
      length: 499
    },
    account_or_reference_number: {
      type: 'string',
      length: 499
    },
    amount: {
      type: 'string',
      length: 499
    },
    notes: {
      type: 'string',
      length: 499
    },
    proof_of_payment_file_id: {
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
  db.dropTable('payments', callback);
};

exports._meta = {
  "version": 1
};
