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
  db.createTable('merchants_auth_tokens', {
    token: {
      type: 'string',
      primaryKey: true,
      length: 255
    },
    merchant_id: {
      type: 'int'
    },
    expiry_date: {
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
  db.dropTable('merchants_auth_tokens', callback);
};

exports._meta = {
  "version": 1
};
