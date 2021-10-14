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
  db.createTable('drivers', {
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
      length: 25,
      notNull: false,
    },
    last_name: {
      type: 'string',
      length: 25,
      notNull: false,
    },
    face_id: {
      type: 'string',
      length: 255,
      notNull: false,
    },
    vehicle_model: {
      type: 'string',
      length: 255
    },
    vehicle_color: {
      type: 'string',
      length: 255
    },
    vehicle_plate_number: {
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
  db.dropTable('drivers', callback);
};

exports._meta = {
  "version": 1
};
