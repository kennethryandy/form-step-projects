const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');

// Validators
exports.validate = (method) => {
  switch (method) {
    case 'add': {
     return [ 
        check('product_name', 'product_name doesn`t exists.').exists(),
        check('product_name', 'product_name maximum characters must be 255.').isLength({ max: 255 }),
        check('product_price', 'product_price doesn`t exists.').exists(),
        check('product_price', 'product_price must be a number.').isNumeric(),
        check('product_quantity', 'product_quantity doesn`t exists.').exists(),
        check('product_quantity', 'product_quantity must be a number.').isNumeric(),
        check('category', 'category doesn`t exists.').exists(),
        check('category', 'category maximum characters must be 255.').isLength({ max: 255 }),
        check('status', 'status doesn`t exists.').exists(),
        check('details', 'details doesn`t exists.').exists(),
        check('details', 'details maximum characters must be 255.').isLength({ max: 255 }),
       ]
    }
    case 'update': {
     return [ 
        check('merchant_product_id', 'merchant_product_id doesn`t exists.').exists(),
        check('merchant_product_id', 'merchant_product_id must be a number.').isNumeric(),
        check('product_name', 'product_name doesn`t exists.').exists(),
        check('product_name', 'product_name maximum characters must be 255.').isLength({ max: 255 }),
        check('product_price', 'product_price doesn`t exists.').exists(),
        check('product_price', 'product_price must be a number.').isNumeric(),
        check('product_quantity', 'product_quantity doesn`t exists.').exists(),
        check('product_quantity', 'product_quantity must be a number.').isNumeric(),
        check('category', 'category doesn`t exists.').exists(),
        check('category', 'category maximum characters must be 255.').isLength({ max: 255 }),
        check('status', 'status doesn`t exists.').exists(),
        check('details', 'details doesn`t exists.').exists(),
        check('details', 'details maximum characters must be 255.').isLength({ max: 255 }),
       ]
    }
    case 'details': {
     return [ 
        check('merchant_product_id', 'merchant_product_id doesn`t exists.').exists(),
        check('merchant_product_id', 'merchant_product_id must be a number.').isNumeric(),
       ]
    }
    case 'delete': {
     return [ 
        check('merchant_product_ids', 'merchant_product_ids doesn`t exists.').exists(),
       ]
    }
  }
};

function randomString() {
  var length = 9;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var nums = "0123456789";
  var result = '';
  for (var i = length; i > 0; --i) {
    if(i == 3){
      result += '-';
    }else if(i > 3){
      result += chars[Math.floor(Math.random() * chars.length)];
    }else{
      result += nums[Math.floor(Math.random() * nums.length)];
    }
  }
  return result;
}

exports.index = (request, response) => {

  var merchant_id = request.merchant_id;

  pool.query('SELECT * FROM merchants_products WHERE merchant_id = $1 ORDER by id DESC', [merchant_id], (error, results) => {

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

exports.add = (request, response) => {

  const error = validationResult(request).array();
  if (error.length > 0) {
    response.status(200).json({ 
      error: true,
      message: error[0].msg});
    return;
  }

  var merchant_id = request.merchant_id;
  var { product_name, product_price, product_quantity, category, status, image1_id, image2_id, image3_id, details } = request.body
  var product_code = randomString();

  pool.query('INSERT INTO merchants_products(merchant_id, product_code, product_name, product_price, product_quantity, category, status, image1_id, image2_id, image3_id, details) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id', [merchant_id, product_code, product_name, product_price, product_quantity, category, status, image1_id, image2_id, image3_id, details], (error, results) => {
    if(error){
      return response.status(200).send({
        success: false,
        message: error.detail,
      });
    }
    if(results.rowCount){
      var id = results.rows[0].id;
      if(id <= 9){
        var product_code = 'LETSPC-0'+id;
      }else{
        var product_code = 'LETSPC-'+id;
    }
    pool.query('UPDATE merchants_products SET product_code = $1 WHERE id = $2', [product_code, id]);
      return response.status(200).send({
        success: true,
        message: 'Product successfully added.'
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

  var { merchant_product_id, product_name, product_price, product_quantity, category, status, image1_id, image2_id, image3_id, details } = request.body

  pool.query('UPDATE merchants_products SET product_name = $1, product_price = $2, product_quantity = $3, category = $4, status = $5, image1_id = $6, image2_id = $7, image3_id = $8, details = $9 WHERE id = $10', [product_name, product_price, product_quantity, category, status, image1_id, image2_id, image3_id, details, merchant_product_id], (error, results) => {
    if(error){
      return response.status(200).send({
        success: false,
        message: error.detail,
      });
    }
    if(results.rowCount){
      return response.status(200).send({
        success: true,
        message: 'Product successfully updated.'
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
  var { merchant_product_ids } = request.body


  merchant_product_ids.forEach(function(merchant_product_id) {
    pool.query('SELECT id FROM merchants_products WHERE id = $1 AND merchant_id = $2', [merchant_product_id, merchant_id], (error, results) => {
      if(results.rowCount){
        pool.query('DELETE FROM merchants_products WHERE id = $1', [merchant_product_id]);
      }
    });
  });

  return response.status(200).send({
    success: true,
    message: 'Products has been successfully deleted.'
  });

};

exports.generateCode = (request, response) => {
  
  pool.query('SELECT id FROM merchants_products ORDER BY id DESC', (error, results) => {
    if(results.rowCount){
      var id = results.rows[0].id + 1;
      if(id <= 9){
        var product_code = 'LETSPC-0'+id;
      }else{
        var product_code = 'LETSPC-'+id;
    }
      
    return response.status(200).send({
      success: true,
      product_code: product_code
    });
    }
  });

};