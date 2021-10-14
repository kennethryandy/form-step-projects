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
  db.createTable('headers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    app_secret: {
      type: 'string',
      length: 999
    },
    android_app_current_version: {
      type: 'string',
      length: 499
    },
    android_app_min_version: {
      type: 'string',
      length: 499
    },
    ios_app_current_version: {
      type: 'string',
      length: 499
    },
    ios_app_min_version: {
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
  db.dropTable('headers', callback);
};

exports._meta = {
  "version": 1
};
