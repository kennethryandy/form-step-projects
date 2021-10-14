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
  db.addColumn('messages', 'subject_id', { type: 'int' }, callback);
  db.addColumn('messages', 'subject', { type: 'string', length: 999 }, callback);
  db.addColumn('messages', 'admin_id', { type: 'int' }, callback);
  db.addColumn('messages', 'driver_id', { type: 'int' }, callback);
  db.addColumn('messages', 'passenger_id', { type: 'int' }, callback);
  db.addColumn('messages', 'is_sent_by_admin', { type: 'boolean' }, callback);
  db.removeColumn('messages', 'message_to', callback);
  db.removeColumn('messages', 'message_from', callback);
  db.removeColumn('messages', 'receiver_id', callback);
  db.removeColumn('messages', 'sender_id', callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
