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
  db.createTable('push_notification_tokens', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    phone_number: {
      type: 'string',
      length: 11,
      notNull: true
    },
    token: {
      type: 'string',
      length: 999,
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
  db.dropTable('push_notification_tokens', callback);
};

exports._meta = {
  "version": 1
};
