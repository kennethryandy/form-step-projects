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

exports.up = function(db, callback) {
  db.renameTable('users', 'passengers', callback);
  db.renameTable('otp_verifications', 'passengers_otp_verifications', callback);
  db.renameTable('auth_token', 'passengers_auth_token', callback);
  db.renameTable('passenger_facebook', 'passengers_facebook', callback);
};

exports.down = function(db, callback) {
  db.dropTable('passengers', callback);
  db.dropTable('passengers_otp_verifications', callback);
  db.dropTable('passengers_auth_token', callback);
  db.dropTable('passengers_facebook', callback);
};

exports._meta = {
  "version": 1
};
