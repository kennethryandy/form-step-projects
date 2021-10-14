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
  db.addColumn('drivers', 'performance_rate', { type: 'decimal(5,2)', defaultValue: 0}, callback);
  db.addColumn('drivers', 'performance_acceptance_rate', { type: 'decimal(5,2)', defaultValue: 0}, callback);
  db.addColumn('drivers', 'performance_cancellation_rate', { type: 'decimal(5,2)', defaultValue: 0}, callback);
  db.addColumn('drivers', 'performance_total_referral', { type: 'int', defaultValue: 0}, callback);
  db.addColumn('drivers', 'performance_total_earn', { type: 'decimal(12,2)', defaultValue: 0}, callback);
};

exports.down = function (db, callback) {
  db.dropTable('drivers_performances', callback);
};

exports._meta = {
  "version": 1
};
