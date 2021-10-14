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
  db.addColumn('ride_calculations', 'type_of_service', { type: 'string', length: 49, defaultValue: 'pasakay'}, callback);
  db.addColumn('ride_calculations', 'specification', { type: 'string', length: 499}, callback);
  db.addColumn('ride_calculations', 'item_description', { type: 'string', length: 499}, callback);
  db.addColumn('ride_calculations', 'image_file_id_1', { type: 'int' }, callback);
  db.addColumn('ride_calculations', 'image_file_id_2', { type: 'int' }, callback);
  db.addColumn('ride_calculations', 'notes', { type: 'string', length: 499}, callback);
  db.changeColumn('ride_calculations', 'price', {
    type: 'decimal(12,2)'
  }, callback);
  db.addColumn('ride_calculations', 'order', { type: 'string', length: 499}, callback);
  db.addColumn('ride_calculations', 'order_file_id', { type: 'int' }, callback);
  db.addColumn('ride_calculations', 'receipt_file_id', { type: 'int' }, callback);
  db.addColumn('ride_calculations', 'store_name', { type: 'string', length: 499}, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
