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
  db.createTable('pabili_requests', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    passenger_phone_number: {
      type: 'string',
      length: 15,
      notNull: true
    },
    order: {
      type: 'string',
      length: 255
    },
    image_url_order: {
      type: 'string',
      length: 255
    },
    image_url_receipt: {
      type: 'string',
      length: 255
    },
    notes: {
      type: 'string',
      length: 255
    },
    price: {
      type: 'decimal'
    },
    duration_text: {
      type: 'string',
      length: 255
    },
    duration_value: {
      type: 'int'
    },
    distance_text: {
      type: 'string',
      length: 255
    },
    distance_value: {
      type: 'int'
    },
    pick_up_location_name: {
      type: 'string',
      length: 255
    },
    pick_up_location_lat: {
      type: 'string',
      length: 255
    },
    pick_up_location_lng: {
      type: 'string',
      length: 255
    },
    pick_up_location_geo_hash: {
      type: 'string',
      length: 255
    },
    drop_off_location_name: {
      type: 'string',
      length: 255
    },
    drop_off_location_lat: {
      type: 'string',
      length: 255
    },
    drop_off_location_lng: {
      type: 'string',
      length: 255
    },
    drop_off_location_geo_hash: {
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
  db.dropTable('pabili_requests', callback);
};

exports._meta = {
  "version": 1
};
