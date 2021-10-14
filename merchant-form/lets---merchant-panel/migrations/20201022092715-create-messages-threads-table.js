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
  db.createTable('messages_threads', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: 'string',
      length: 999
    },
    admin_id: {
      type: 'int'
    },
    driver_phone_number: {
      type: 'string',
      length: 99
    },
    passenger_phone_number: {
      type: 'string',
      length: 99
    },
    status: {
      type: 'string',
      length: 299
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('messages_threads', callback);
};

exports._meta = {
  "version": 1
};
