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
  db.createTable('pabili_requests_image_files', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    pabili_request_id: {
      type: 'int'
    },
    type: {
      type: 'string',
      length: 49
    },
    image_url: {
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
  db.dropTable('pabili_requests_image_files', callback);
};

exports._meta = {
  "version": 1
};
