const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');

// Validators
exports.validate = (method) => {
  switch (method) {
    case 'transaction': {
     return [ 
        check('order_id', 'order_id doesn`t exists.').exists(),
        check('order_id', 'order_id must be a number.').isNumeric(),
       ]
    }
    case 'cancel': {
     return [ 
        check('merchant_order_ids', 'merchant_order_ids doesn`t exists.').exists(),
       ]
    }
    case 'process': {
     return [ 
        check('merchant_order_ids', 'merchant_order_ids doesn`t exists.').exists(),
       ]
    }
  }
};

exports.index = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query("SELECT * FROM merchants_customer_orders WHERE merchant_id = $1", [merchant_id], (error, results) => {
    if(error){
      throw error
    }
    if(results.rowCount){
      return response.status(200).send({
        success: true,
        data: results.rows
      });
    }else{
      return response.status(200).send({
        success: false,
        message: "No Order Found.",
        data: results.rows
      });
    }
  });

};

exports.transaction = (request, response) => {

  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }

  var merchant_id = request.merchant_id;
  var { order_id } = request.body

  pool.query("SELECT * FROM merchants_customer_orders WHERE merchant_id = $1 AND id = $2", [merchant_id, order_id], (error, results) => {
    if(error){
      throw error
    }
    if(results.rowCount){
      var product_ids = results.rows[0].product_ids;
      
        pool.query("SELECT * FROM merchants_products WHERE id IN ("+product_ids+") AND merchant_id = $1", [merchant_id], (error, productResults) => {
          if(error){
            throw error
          }
          return response.status(200).send({
            success: true,
            data: {
              transaction: results.rows,
              products: productResults.rows
            }
          });
        });


    }else{
      return response.status(200).send({
        success: false,
        message: "No Order Found.",
        data: results.rows
      });
    }
  });

};

exports.cancel = (request, response) => {


  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }
  
  var merchant_id = request.merchant_id;
  var { merchant_order_ids } = request.body


  merchant_order_ids.forEach(function(merchant_order_id) {
    pool.query('SELECT id FROM merchants_customer_orders WHERE id = $1 AND merchant_id = $2', [merchant_order_id, merchant_id], (error, results) => {
      if(results.rowCount){
        pool.query('UPDATE merchants_customer_orders SET status = $1 WHERE id = $2', ['cancelled_by_merchant', merchant_order_id]);
      }
    });
  });

  return response.status(200).send({
    success: true,
    message: 'Orders has been successfully cancelled.'
  });

};

exports.process = (request, response) => {


  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }
  
  var merchant_id = request.merchant_id;
  var { merchant_order_ids } = request.body


  merchant_order_ids.forEach(function(merchant_order_id) {
    pool.query('SELECT id FROM merchants_customer_orders WHERE id = $1 AND merchant_id = $2', [merchant_order_id, merchant_id], (error, results) => {
      if(results.rowCount){
        pool.query('UPDATE merchants_customer_orders SET status = $1 WHERE id = $2', ['processed', merchant_order_id]);
      }
    });
  });

  return response.status(200).send({
    success: true,
    message: 'Orders has been successfully processed.'
  });

};