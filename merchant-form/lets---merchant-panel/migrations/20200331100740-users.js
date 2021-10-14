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
  db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    phone_number: {
      type: 'string',
      length: 15
    },
    first_name: {
      type: 'string',
      length: 25
    },
    last_name: {
      type: 'string',
      length: 25
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('users', callback);
};

exports._meta = {
  "version": 1
};
