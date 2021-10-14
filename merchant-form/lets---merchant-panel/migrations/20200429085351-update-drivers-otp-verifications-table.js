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
  db.addColumn('drivers_otp_verifications', 'expiry_date', { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP')}, callback);
  db.addColumn('drivers_otp_verifications', 'id', { type: 'int', primaryKey: true, autoIncrement: true}, callback);
  db.addColumn('passengers_otp_verifications', 'expiry_date', { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP')}, callback);
  db.addColumn('passengers_otp_verifications', 'id', { type: 'int', primaryKey: true, autoIncrement: true}, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('drivers_otp_verifications', 'expiry_date', callback);
  db.removeColumn('drivers_otp_verifications', 'id', callback);
  db.removeColumn('passengers_otp_verifications', 'expiry_date', callback);
  db.removeColumn('passengers_otp_verifications', 'id', callback);
};

exports._meta = {
  "version": 1
};
