const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');

// Validators
exports.validate = (method) => {
  switch (method) {
    case 'ban': {
     return [ 
        check('merchant_customer_phone_numbers', 'merchant_customer_phone_numbers doesn`t exists.').exists(),
       ]
    }
  }
};

exports.index = (request, response) => {

  var merchant_id = request.merchant_id;
  
  pool.query("SELECT DISTINCT ON(merchants_customer_orders.customer_phone_number) passengers.* FROM merchants_customer_orders INNER JOIN passengers ON merchants_customer_orders.customer_phone_number = passengers.phone_number WHERE merchants_customer_orders.merchant_id = $1", [merchant_id], (error, results) => {
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
        message: "No Customer Found.",
        data: results.rows
      });
    }
  });

};

exports.ban = (request, response) => {


  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }
  
  var merchant_id = request.merchant_id;
  var { merchant_customer_phone_numbers } = request.body


  merchant_customer_phone_numbers.forEach(function(merchant_customer_phone_number) {
    pool.query('INSERT INTO merchants_banned_customers(passenger_phone_number, merchant_id) VALUES($1, $2)', [merchant_customer_phone_number, merchant_id], (error, results) => {
    });
  });

  return response.status(200).send({
    success: true,
    message: 'Selected Customers has been successfully banned.'
  });

};
