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
  db.createTable('location_searches', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    passenger_phone_number: {
      type: 'string',
      length: 15
    },
    location_name: {
      type: 'string',
      length: 255
    },
    location_sub_name: {
      type: 'string',
      length: 255
    },
    location_lat: {
      type: 'string',
      length: 255
    },
    location_lng: {
      type: 'string',
      length: 255
    },
    location_geohash: {
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
  db.dropTable('location_searches', callback);
};

exports._meta = {
  "version": 1
};
