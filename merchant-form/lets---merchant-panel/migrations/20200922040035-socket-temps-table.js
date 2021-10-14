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
  db.createTable('socket_temp', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: 'string'
    },
    type: {
      type: 'int'
    },
    phone_number: {
      type: 'string',
      length: 11,
      notNull: true
    },
    is_given: {
      type: 'boolean',
      defaultValue: false
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
  db.dropTable('socket_temp', callback);
};

exports._meta = {
  "version": 1
};
