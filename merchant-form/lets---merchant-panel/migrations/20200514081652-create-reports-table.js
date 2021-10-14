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
  db.createTable('reports', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    reported_by: {
      type: 'string',
      length: 15
    },
    reported: {
      type: 'string',
      length: 15
    },
    message: {
      type: 'string',
      length: 255
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('reports', callback);
};

exports._meta = {
  "version": 1
};
