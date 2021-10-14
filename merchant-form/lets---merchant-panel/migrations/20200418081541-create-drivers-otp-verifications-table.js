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
  db.createTable('drivers_otp_verifications', {
    phone_number: {
      type: 'string',
      length: 15
    },
    version: {
      type: 'string',
      length: 255
    },
    device: {
      type: 'string',
      length: 15
    },
    otp: {
      type: 'string',
      length: 4
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('drivers_otp_verifications', callback);
};

exports._meta = {
  "version": 1
};
