const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');

// Validators
exports.validate = (method) => {
  switch (method) {
    case 'update': {
     return [ 
      check('email', 'email doesn`t exists.').exists(),
      check('email', 'email must be a valid email address.').isEmail(),
      check('email', 'email maximum characters must be 255.').isLength({ max: 255 }),
      check('store_name', 'store_name doesn`t exists.').exists(),
      check('store_name', 'store_name maximum characters must be 255.').isLength({ max: 255 }),
      check('store_hours_start', 'store_hours_start doesn`t exists.').exists(),
      check('store_hours_end', 'store_hours_end doesn`t exists.').exists(),
      check('location_full_address', 'location_full_address doesn`t exists.').exists(),
      check('location_full_address', 'location_full_address maximum characters must be 255.').isLength({ max: 255 }),
      check('store_description', 'store_description doesn`t exists.').exists(),
      check('store_description', 'store_description maximum characters must be 255.').isLength({ max: 255 }),
      check('phone_number', 'phone_number maximum characters must be 20.').isLength({ max: 20 }),
      check('landline_number', 'landline_number maximum characters must be 20.').isLength({ max: 20 }),
      check('category', 'category doesn`t exists.').exists(),
      check('lat', 'lat doesn`t exists.').exists(),
      check('lng', 'lng doesn`t exists.').exists(),
      check('place_id', 'place_id doesn`t exists.').exists(),
      check('store_logo_file_id', 'store_logo_file_id must be a number.').isNumeric(),
       ]
    }
  }
};

exports.profile = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('SELECT * FROM merchants WHERE id = $1', [merchant_id], (error, results) => {

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        data: results.rows
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid.'
      });
    }
  });

};

exports.activate = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('UPDATE merchants SET is_deactivated = false WHERE id = $1', [merchant_id], (error, results) => {

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Account has been successfully activated.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid.'
      });
    }
  });

};

exports.deactivate = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('UPDATE merchants SET is_deactivated = true WHERE id = $1', [merchant_id], (error, results) => {

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Account has been successfully deactivated.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid.'
      });
    }
  });

};

exports.permanentlyDelete = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('UPDATE merchants SET is_permanently_deleted = true WHERE id = $1', [merchant_id], (error, results) => {

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Account has been successfully deleted.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid.'
      });
    }
  });
  
};

exports.update = (request, response) => {

  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }

  var merchant_id = request.merchant_id;
  var { store_logo_file_id,
    email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, category, phone_number, landline_number, lat, lng, place_id,
    monday_store_hours_start,
    monday_store_hours_end,
    tuesday_store_hours_start,
    tuesday_store_hours_end,
    wednesday_store_hours_start,
    wednesday_store_hours_end,
    thursday_store_hours_start,
    thursday_store_hours_end,
    friday_store_hours_start,
    friday_store_hours_end,
    saturday_store_hours_start,
    saturday_store_hours_end,
    sunday_store_hours_start,
    sunday_store_hours_end } = request.body

  pool.query('UPDATE merchants SET store_logo_file_id = $1, email = $2, store_name = $3, store_hours_start = $4, store_hours_end = $5, location_full_address = $6, store_description = $7, category = $8, phone_number = $9, landline_number = $10, location_lat = $11, location_lng = $12, place_id = $13, monday_store_hours_start = $14, monday_store_hours_end = $15, tuesday_store_hours_start = $16, tuesday_store_hours_end = $17, wednesday_store_hours_start = $18, wednesday_store_hours_end = $19, thursday_store_hours_start = $20, thursday_store_hours_end = $21, friday_store_hours_start = $22, friday_store_hours_end = $23, saturday_store_hours_start = $24, saturday_store_hours_end = $25, sunday_store_hours_start = $26, sunday_store_hours_end = $27 WHERE id = $28',
  [store_logo_file_id, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, category, phone_number, landline_number, lat, lng, place_id, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, merchant_id], (error, results) => {
    
    if(error){
      console.log(error);
      return response.status(200).json({ 
          success: false,
          error_code: 102,
          message: error.detail
      });
  }

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Store has been successfully updated.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid.'
      });
    }
  });

};