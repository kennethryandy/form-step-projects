const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');

// Validators
exports.validate = (method) => {
  switch (method) {
    case 'add': {
     return [ 
      check('promo', 'promo doesn`t exists.').exists(),
      check('promo', 'promo maximum characters must be 255.').isLength({ max: 255 }),
      check('percentage', 'percentage doesn`t exists.').exists(),
      check('percentage', 'percentage must be a number.').isNumeric(),
      check('start_date', 'start_date doesn`t exists.').exists(),
      check('start_date', 'start_date maximum characters must be 255.').isLength({ max: 255 }),
      check('end_date', 'end_date doesn`t exists.').exists(),
      check('end_date', 'end_date maximum characters must be 255.').isLength({ max: 255 }),
      check('status', 'status doesn`t exists.').exists(),
      check('count', 'count doesn`t exists.').exists(),
      check('count', 'count must be a number.').isNumeric(),
      check('amount', 'amount doesn`t exists.').exists(),
      check('amount', 'amount must be a number.').isNumeric(),
      check('promo_amount', 'promo_amount doesn`t exists.').exists(),
      check('promo_amount', 'promo_amount must be a number.').isNumeric(),
      check('usage', 'usage doesn`t exists.').exists(),
      check('usage', 'usage must be a number.').isNumeric(),
       ]
    }
    case 'update': {
     return [ 
      check('promo', 'promo doesn`t exists.').exists(),
      check('promo', 'promo maximum characters must be 255.').isLength({ max: 255 }),
      check('percentage', 'percentage doesn`t exists.').exists(),
      check('percentage', 'percentage must be a number.').isNumeric(),
      check('start_date', 'start_date doesn`t exists.').exists(),
      check('start_date', 'start_date maximum characters must be 255.').isLength({ max: 255 }),
      check('end_date', 'end_date doesn`t exists.').exists(),
      check('end_date', 'end_date maximum characters must be 255.').isLength({ max: 255 }),
      check('status', 'status doesn`t exists.').exists(),
      check('count', 'count doesn`t exists.').exists(),
      check('count', 'count must be a number.').isNumeric(),
      check('amount', 'amount doesn`t exists.').exists(),
      check('amount', 'amount must be a number.').isNumeric(),
      check('promo_amount', 'promo_amount doesn`t exists.').exists(),
      check('promo_amount', 'promo_amount must be a number.').isNumeric(),
      check('usage', 'usage doesn`t exists.').exists(),
      check('usage', 'usage must be a number.').isNumeric(),
      check('promo_id', 'promo_id doesn`t exists.').exists(),
      check('promo_id', 'promo_id must be a number.').isNumeric(),
       ]
    }
    case 'delete': {
     return [ 
        check('merchant_promo_ids', 'merchant_promo_ids doesn`t exists.').exists(),
       ]
    }
  }
};

function randomString() {
  var length = 6;
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

exports.index = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('SELECT * FROM merchants_promos WHERE merchant_id = $1', [merchant_id], (error, results) => {

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

exports.add = (request, response) => {

  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }

  var merchant_id = request.merchant_id;
  var { promo, percentage, start_date, end_date, status, count, amount, promo_amount, usage, type } = request.body
  var promo_code = randomString();

  pool.query('INSERT INTO merchants_promos(merchant_id, promo_code, promo, percentage, start_date, end_date, status, count, amount, promo_amount, usage, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [merchant_id, promo_code, promo, percentage, start_date, end_date, status, count, amount, promo_amount, usage, type], (error, results) => {
    if(error){
      return response.status(200).send({
        success: false,
        message: error.detail,
      });
    }
    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Promo successfully added.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid details.'
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
  var { promo, percentage, start_date, end_date, status, count, amount, promo_amount, usage, promo_id } = request.body

  pool.query('UPDATE merchants_promos SET promo = $1, percentage = $2, start_date = $3, end_date = $4, status = $5, count = $6, amount = $7, promo_amount = $8, usage = $9 WHERE id = $10 AND merchant_id = $11', [promo, percentage, start_date, end_date, status, count, amount, promo_amount, usage, promo_id, merchant_id], (error, results) => {
    if(error){
      return response.status(200).send({
        success: false,
        message: error.detail,
      });
    }
    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Promo successfully updated.'
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'Invalid details.'
      });
    }

  });

};

exports.details = (request, response) => {


  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }
  
  var merchant_id = request.merchant_id;
  var { merchant_product_id } = request.body

  pool.query('SELECT * FROM merchants_products WHERE id = $1 AND merchant_id = $2', [merchant_product_id, merchant_id], (error, results) => {

    if(results.rowCount){
      return response.status(200).send({
        success: true,
        data: results.rows
      });
    }else{
      return response.status(200).send({
        success: false,
        message: 'No pruduct found.',
        data: results.rows
      });
    }

  });

};

exports.delete = (request, response) => {


  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }
  
  var merchant_id = request.merchant_id;
  var { merchant_promo_ids } = request.body


  merchant_promo_ids.forEach(function(merchant_promo_id) {
    pool.query('SELECT id FROM merchants_promos WHERE id = $1 AND merchant_id = $2', [merchant_promo_id, merchant_id], (error, results) => {
      if(results.rowCount){
        pool.query('DELETE FROM merchants_promos WHERE id = $1', [merchant_promo_id]);
      }
    });
  });

  return response.status(200).send({
    success: true,
    message: 'Promos has been successfully deleted.'
  });

};