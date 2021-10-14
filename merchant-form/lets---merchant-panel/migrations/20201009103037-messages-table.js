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
  db.createTable('messages', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    message_to: {
      type: 'string',
      length: 199,
      notNull: true
    },
    message_from: {
      type: 'string',
      length: 199,
      notNull: true
    },
    receiver_id: {
      type: 'int',
      notNull: true
    },
    sender_id: {
      type: 'int',
      notNull: true
    },
    message: {
      type: 'string',
      length: 999,
      notNull: true
    },
    is_viewed: {
      type: 'boolean',
      defaultValue: false
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('messages', callback);
};

exports._meta = {
  "version": 1
};
