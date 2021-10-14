
const pool = require("../../models/db");
const { check, validationResult } = require('express-validator');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var config = require('../../config/token.config');
const axios = require('axios');
const fs = require('fs');
const Path = require('path');

// Variables
const variables = require("../../config/variables.config");
const googleApiKey = variables.googleApiKey;
const protocol = variables.protocol;
const Geohash = require('ngeohash');
var md5 = require('md5');
const nodemailer = require("nodemailer");

// Validators
exports.validate = (method) => {
    switch (method) {
      case 'signIn': {
       return [ 
          check('username', 'username/email doesn`t exists.').exists(),
          check('username', 'username/email doesn`t exists.').exists(),
          check('password', 'password doesn`t exists.').exists(),
         ]
      }
      case 'forgotPassword': {
       return [ 
        check('email', 'email doesn`t exists.').exists(),
        check('email', 'email must be a valid email address.').isEmail(),
        check('email', 'email maximum characters must be 255.').isLength({ max: 255 }),
         ]
      }
      case 'resetPassword': {
       return [ 
          check('password', 'password doesn`t exists.').exists(),
          check('password', 'password minimum characters must be 6.').isLength({ min: 6 }),
          check('password', 'password maximum characters must be 99.').isLength({ max: 99 }),
          check('confirm_password', 'confirm_password doesn`t exists.').exists(),
          check('token', 'token doesn`t exists.').exists(),
         ]
      }
      case 'signUp': {
       return [ 
          check('username', 'username doesn`t exists.').exists(),
          check('username', 'username minimum characters must be 4.').isLength({ min: 4 }),
          check('username', 'username maximum characters must be 255.').isLength({ max: 255 }),
          check('email', 'email doesn`t exists.').exists(),
          check('email', 'email must be a valid email address.').isEmail(),
          check('email', 'email maximum characters must be 255.').isLength({ max: 255 }),
          check('password', 'password doesn`t exists.').exists(),
          check('password', 'password maximum characters must be 255.').isLength({ max: 255 }),
          check('password', 'password minimum characters must be 4.').isLength({ min: 4 }),
          check('store_name', 'store_name doesn`t exists.').exists(),
          check('store_name', 'store_name maximum characters must be 255.').isLength({ max: 255 }),
          check('store_hours_start', 'store_hours_start doesn`t exists.').exists(),
          check('store_hours_end', 'store_hours_end doesn`t exists.').exists(),
          check('location_full_address', 'location_full_address doesn`t exists.').exists(),
          check('location_full_address', 'location_full_address maximum characters must be 255.').isLength({ max: 255 }),
          check('store_description', 'store_description maximum characters must be 255.').isLength({ max: 255 }),
          check('phone_number', 'phone_number maximum characters must be 20.').isLength({ max: 20 }),
          check('landline_number', 'landline_number maximum characters must be 20.').isLength({ max: 20 }),
          check('lat', 'lat doesn`t exists.').exists(),
          check('lng', 'lng doesn`t exists.').exists(),
          check('place_id', 'place_id doesn`t exists.').exists(),
         ]
      }
      case 'validateCred': {
       return [ 
          check('username', 'username doesn`t exists.').exists(),
          check('email', 'email doesn`t exists.').exists(),
         ]
      }
      case 'subscriptionForm': {
       return [ 
          check('email', 'email doesn`t exists.').exists(),
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
         ]
      }
    }
  };

// async..await is not allowed in global scope, must use a wrapper
async function mail({email, reset_pass_url, store_name, username, type}) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "support@lets.com.ph", // generated ethereal user
            pass: "_h@cmjm_D58B_4E", // generated ethereal password
        },
    });
    // send mail with defined transport object
    switch (type) {
        case "subscribed": {
            await transporter.sendMail({
                from: 'LetsMerchant.com <support@lets.com.ph>',
                to: email,
                subject:"Create a Password",
                html: subscribedEmailTemplate(store_name, username, reset_pass_url)
            });
        }
        case "forgot_password": {
            await transporter.sendMail({
                from: 'LetsMerchant.com <support@lets.com.ph>',
                to: email,
                subject: "Reset Password",
                html: forgotPasswordEmailTemplate(store_name, email, reset_pass_url)
            });
        }
        case "sign-up": {
            await transporter.sendMail({
                from: 'LetsMerchant.com <support@lets.com.ph>',
                to: email,
                subject: "Successfully Submitted",
                html:signupMerchantEmailTemplate(store_name)
            });
        }
        default:
            break;
    }
    // let info = await transporter.sendMail({
    //   from: 'LetsMerchant.com <support@lets.com.ph>', // sender address
    //   to: email, // list of receivers
    //   subject: (type === "subscribed" ? "Create a Password" :
    //             type === "forgot_password" ? "Reset Password" :
    //             "Successfully Submitted"
    //             ), // Subject line
    // //   text: "Create Password Link: "+message, // plain text body
    //   html: (type === "subscribed" ? subscribedEmailTemplate(store_name, username, reset_pass_url) : 
    //          type === "forgot_password" ? forgotPasswordEmailTemplate(store_name, email, reset_pass_url) :
    //          signupMerchantEmailTemplate(store_name)
    //         )
    // });
    // 
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

const subscribedEmailTemplate = (storeName, username, url) => (`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    </style>
  </head>
  <body style="Margin:0;padding:0;font-family:'Roboto', sans-serif;">
    <div class="wrapper" style="padding:2%;text-align:center;">
      <header style="width:100%;background-color:#ED3C60;display:flex;justify-content:center;">
        <img src="https://lets.com.ph/wp-content/uploads/2021/01/Group-11167.png" class="lets" style="width:80px;Margin:auto;padding:1%;"/>
    </header>
      <div class="content" style="Margin:3% 0px;">
        <h1 class="title" style="font-weight:400;">Welcome, ${storeName}!</h1>
        <p style="font-size:18px;">Thanks for signing up on LETS Merchant. Please be inform that your Store Profile</p>
        <p style="font-size:18px;">has been already submitted. Kindly wait for 2-3 business days for the Admin to review your profile.</p>
        <p style="font-size:18px;">We can't wait for you to start using our platform and seeing results on your business.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Your default username is: <b>${username}</b></p>
        <p style="font-size:18px;">Please click the button below to create your password and sign in.</p>
        <div class="button-wrapper" style="background-color:#FDCC29;width:180px;padding:10px 12px;cursor:pointer;Margin:36px auto;border-radius:8px;">
          <a href="${url}" target="_blank" class="btn" style="font-weight:700;color:#ffffff;text-decoration:none;">CREATE PASSWORD</a>
        </div>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">If you receive this error, please disregard and do nothing.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Cheers!</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">From LetsMerchant.com Team</p>
      </div>
    </div>
  </body>
</html>
`);

const forgotPasswordEmailTemplate = (storeName, email, url) => (`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    </style>
  </head>
  <body style="Margin:0;padding:0;font-family:'Roboto', sans-serif;width:100%;">
    <div class="wrapper" style="padding:2%;text-align:center;Margin:auto;">
      <header style="width:100%;background-color:#ED3C60;display:flex;justify-content:center;">
        <img src="https://lets.com.ph/wp-content/uploads/2021/01/Group-11167.png" class="lets" style="width:80px;Margin:auto;padding:1%;"/>
    </header>
      <div class="content" style="Margin:3% 0px;">
        <h1 class="title" style="font-weight:400;">Hello there, ${storeName}!</h1>
        <p style="font-size:18px;">We received a request to reset password for <b>${email}</b>.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Please click the button below to reset your password.</p>
        <div class="button-wrapper" style="background-color:#FDCC29;width:180px;padding:10px 12px;cursor:pointer;Margin:auto;border-radius:8px;">
          <a href="${url}" target="_blank" class="btn" style="font-weight:700;color:#ffffff;text-decoration:none;">RESET PASSWORD</a>
        </div>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">If you receive this error, please disregard and do nothing</p>
        <p style="font-size:18px;">and your password will still be the same.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Cheers!</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">From LetsMerchant.com Team</p>
      </div>
    </div>
  </body>
</html>
`)

const signupMerchantEmailTemplate = (storeName) => (`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    </style>
  </head>
  <body style="Margin:0;padding:0;font-family:'Roboto', sans-serif;width:100%;">
    <div class="wrapper" style="text-align:center;Margin:auto;padding:2%;">
      <header style="width:100%;background-color:#ED3C60;display:flex;justify-content:center;">
        <img src="https://lets.com.ph/wp-content/uploads/2021/01/Group-11167.png" class="lets" style="width:80px;Margin:auto;padding:1%;"/>
    </header>
      <div class="content" style="Margin:3% 0px;">
        <h1 class="title" style="font-weight:400;">Thank you, ${storeName}!</h1>
        <p style="font-size:18px;">We are happy to inform you that your Store Profile has been already submitted.</p>
        <p style="font-size:18px;">Kindly wait for 2-3 days for the Admin to review your profile.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Check LETS App Now!</p>
        <div class="button-wrapper" style="display:flex;justify-content:center;align-items:center;">
          <a class="store-links" href="https://apps.apple.com/us/app/lets-ph/id1532356780" target="_blank" style="width:260px;height:130px;"><img src="https://lets.com.ph/wp-content/uploads/2021/01/Group-11163.png" style="width:100%;object-fit:cover;"/></a>
          <a class="store-links" href="https://play.google.com/store/apps/details?id=com.lets.consumer" target="_blank" style="width:260px;height:130px;"><img src="https://lets.com.ph/wp-content/uploads/2021/01/Group-11162.png" style="width:100%;object-fit:cover;"/></a>
        </div>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">If you receive this error, please disregard and do nothing.</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">Cheers!</p>
      </div>
      <div class="content" style="Margin:3% 0px;">
        <p style="font-size:18px;">From LetsMerchant.com Team</p>
      </div>
    </div>
  </body>
</html>
`)

async function _upload_image(photo_url, filename) { 

    var path = Path.resolve(`./../api.lets.com/app/controllers/storage/assets/files/`+ filename)
    var writer = fs.createWriteStream(path)
    
    const download = await axios({
      url: photo_url,
      method: 'GET',
      responseType: 'stream'
    })
    
    download.data.pipe(writer)
};

  function randomString() {
    var length = 12;
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
exports.signIn = (request, response) => {

    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    var username = request.body.username;
    var password = request.body.password;

    var hashed_password = md5(password);

    pool.query('SELECT * FROM merchants WHERE (username = $1 OR email = $1) AND password = $2', [username, hashed_password], (error, results) => {
        if (results.rowCount) {
            var merchant_id = results.rows[0].id;
            // Generate Token
            var token = jwt.sign({ merchant_id: merchant_id }, config.secret, {
              expiresIn: 0 // Token Generator
            });
            var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
            pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], (error, tokenResult) => {
                
                if(tokenResult.rowCount){
                    return response.status(200).json({ 
                        success: true,
                        token: tokenResult.rows[0].token
                    });
                }else{
                    return response.status(200).json({ 
                        success: false,
                        message: "Invalid username/email or password"
                    });
                }

            });
        } else {
            return response.status(200).json({ 
                success: false,
                message: "Invalid username/email or password"
            });
        }	
    });

};

exports.subscriptionForm = (request, response) => {
    
    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    var { email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, category, phone_number, landline_number, lat, lng, place_id,
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
        sunday_store_hours_end,
        username,
        store_logo_file_id,
        store_logo_url
    } = request.body

    // Generate Token
    var reset_password_token = jwt.sign({ merchant_id: email }, config.secret, {
      expiresIn: 0 // Token Generator
      });

    // Generate Token
    var token = jwt.sign({ merchant_id: email }, config.secret, {
        expiresIn: 0 // Token Generator
        });
    var random_string = randomString();
    if(!email){
        var email = random_string+'@email.com';
    }

    if(!username){
        var username = random_string;
    }

    if(store_logo_url){
              
        var store_logo = store_logo_url;
        var filename = random_string+'.jpg';
        var store_logo_url = '/public/files/'+filename;

        
        var photo_url = store_logo;
        _upload_image(photo_url, filename);

    
    }else{
        var store_logo_url = false;
    }

    if(!lat || !lng){
        var params = {
            key: 'AIzaSyDWoVMAOBqMM2o8WGb1mIOmbMxdhWJmkvg',
            place_id: place_id,
          };
        var api_config = {
            method: 'post',
            url: 'https://maps.googleapis.com/maps/api/place/details/json',
            params
    }
    
    
        
        axios(api_config)
        .then( function (res) {
            var location_lat = res.data.result.geometry.location.lat;
            var location_lng = res.data.result.geometry.location.lng;

            var geohash = Geohash.encode(location_lat, location_lng);
            // console.log(location_lat, location_lng, "GEOCODE ===> ", Geohash.encode(location_lat, location_lng))
                    pool.query('INSERT INTO merchants(username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, reset_password_token) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30 ) RETURNING id', [
                        username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, reset_password_token
                    ], (error, results) => {
                
                        if(error){
                            console.log(error);
                            return response.status(200).json({ 
                                success: false,
                                error_code: 102,
                                message: error.detail
                            });
                        }
                        if (results.rowCount) {
                            var merchant_id = results.rows[0].id;
                            var username = 'letsmerchant'+merchant_id;
                            pool.query('UPDATE merchants SET username = $1 WHERE id = $2', [ username, merchant_id ]);
                            if(store_logo_url){
                
                                pool.query('INSERT into file_uploads(file_url) VALUES($1) RETURNING id', [ store_logo_url ], (error, fileResults) => {
                
                                  if(fileResults.rowCount){
                                    var file_id = fileResults.rows[0].id;
                                    pool.query('UPDATE merchants SET store_logo_file_id = $1 WHERE id = $2', [ file_id, merchant_id ]);
                                  }
                                  
                                });
                                  
                              }
                              
                            var reset_pass_url = protocol+'://'+request.headers.host+'/reset-password/'+reset_password_token;
                            // var message = "Please create a password to login.<a>"+reset_pass_url+"</a>";
                            mail({email, reset_pass_url, store_name, username, type: "subscribed"}).catch(console.error);

                            var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
                            pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], async (error, tokenResult) => {
                                if(error){
                                    throw error
                                }
                                if(tokenResult.rowCount){
                                    //  //Email after subcription
                                    // const emailToken = jwt.sign({ merchant_id: merchant_id }, config.secret, {
                                    //     expiresIn: '3h' // Token Generator
                                    //     });
                                    // const create_password_url = `https://merchant.lets.com.ph/new-account/${emailToken}`
                                    // const info = await mail(email, create_password_url, store_name, username)
                                    return response.status(200).json({ 
                                        success: true,
                                        message: "Successfully subscribed.",
                                        merchant_id: tokenResult.rows[0].merchant_id,
                                        token: tokenResult.rows[0].token,
                                        // messageId: info.messageId ? info.messageId : "Mail failed"
                                    });
                                }else{
                                    return response.status(200).json({ 
                                        success: false,
                                        message: "Invalid username/email or password"
                                    });
                                }
                
                            });
        
                        } else {
                            return response.status(200).json({ 
                                success: false,
                                message: "Invalid details."
                            });
                        }	
                    });
            })
        .catch(function (error) {
              console.log(error);
              return response.status(200).send({
                success: false,
                message: error
              });
        });
    }else{
        var location_lat = Number(lat);
        var location_lng = Number(lng);
        var geohash = Geohash.encode(location_lat, location_lng);
        // console.log(location_lat, location_lng, "GEOCODE ===> ", Geohash.encode(location_lat, location_lng))
        pool.query('INSERT INTO merchants(username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, reset_password_token) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30 ) RETURNING id', [
            username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, reset_password_token
                ], (error, results) => {
            
                    if(error){
                        console.log(error);
                        return response.status(200).json({ 
                            success: false,
                            error_code: 102,
                            message: error.detail
                        });
                    }
                    if (results.rowCount) {
            
                        var merchant_id = results.rows[0].id;
                        var username = 'letsmerchant'+merchant_id;
                        pool.query('UPDATE merchants SET username = $1 WHERE id = $2', [ username, merchant_id ]);

                        var reset_pass_url = protocol+'://'+request.headers.host+'/reset-password/'+reset_password_token;
                        // var message = "Please create a password to login.<a>"+reset_pass_url+"</a>";
                        mail({email, reset_pass_url, store_name, username, type: "subscribed"}).catch(console.error);
                        if(store_logo_url){
            
                            pool.query('INSERT into file_uploads(file_url) VALUES($1) RETURNING id', [ store_logo_url ], (error, fileResults) => {
            
                              if(fileResults.rowCount){
                                var file_id = fileResults.rows[0].id;
                                pool.query('UPDATE merchants SET store_logo_file_id = $1 WHERE id = $2', [ file_id, merchant_id ]);
                              }
                              
                            });
                              
                          }
                         
                            // Generate Token
                            var token = jwt.sign({ merchant_id: merchant_id }, config.secret, {
                            expiresIn: 0 // Token Generator
                          });
                          var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
                          pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], async (error, tokenResult) => {
                              if(error){
                                  throw error
                              }
                              if(tokenResult.rowCount){
                                  return response.status(200).json({ 
                                      success: true,
                                      message: "Successfully subscribed.",
                                      merchant_id: tokenResult.rows[0].merchant_id,
                                      token: tokenResult.rows[0].token,
                                  });
                              }else{
                                  return response.status(200).json({ 
                                      success: false,
                                      message: "Invalid username/email or password"
                                  });
                              }
              
                          });
    
                    } else {
                        return response.status(200).json({ 
                            success: false,
                            message: "Invalid details."
                        });
                    }	
                });
    }


};

exports.signUp = (request, response) => {

    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    
    var { email, username, password, 
        store_name, 
        store_hours_start, 
        store_hours_end, 
        location_full_address, 
        store_description, 
        category, 
        phone_number, 
        landline_number, 
        lat, lng, place_id,
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
        sunday_store_hours_end,
        store_logo_file_id
    } = request.body

    // Generate Token
    var reset_password_token = jwt.sign({ merchant_id: email }, config.secret, {
        expiresIn: 0 // Token Generator
        });

    var password = md5(password);
        if(!lat || !lng){
            var params = {
                key: 'AIzaSyDWoVMAOBqMM2o8WGb1mIOmbMxdhWJmkvg',
                place_id: place_id,
              };
            var api_config = {
                method: 'post',
                url: 'https://maps.googleapis.com/maps/api/place/details/json',
                params
        }
        axios(api_config)
        .then( function (res){
            var location_lat = res.data.result.geometry.location.lat;
            var location_lng = res.data.result.geometry.location.lng;
            var geohash = Geohash.encode(location_lat, location_lng);
                pool.query('INSERT INTO merchants(username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30 ) RETURNING id', [
                    username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, password
                ], (error, results) => {
                    if(error){
                        console.log(error);
                        return response.status(200).json({ 
                            success: false,
                            error_code: 102,
                            message: error.detail
                        });
                    }
                    if (results.rowCount) {
                        var merchant_id = results.rows[0].id;

                        var reset_pass_url = protocol+'://'+request.headers.host+'/reset-password/'+reset_password_token;
                        mail({email, reset_pass_url, store_name, username, type: "sign-up"}).catch(console.error);

                        // Generate Token
                        var token = jwt.sign({ merchant_id: merchant_id }, config.secret, {
                        expiresIn: 0 // Token Generator
                        });
                        var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
                        pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], (error, tokenResult) => {
                            if(error){
                                throw error
                            }
                            if(tokenResult.rowCount){
                                return response.status(200).json({ 
                                    success: true,
                                    message: "Successfully signed up.",
                                    merchant_id: tokenResult.rows[0].merchant_id,
                                    token: tokenResult.rows[0].token
                                });
                            }else{
                                return response.status(200).json({ 
                                    success: false,
                                    message: "Invalid username/email or password"
                                });
                            }
            
                        });
    
                    } else {
                        return response.status(200).json({ 
                            success: false,
                            message: "Invalid details."
                        });
                    }
                })
        }).catch(function (error) {
            console.log(error);
            return response.status(200).send({
              success: false,
              message: error
            });
      });
    }else{
        var location_lat = Number(lat);
        var location_lng = Number(lng);
        var geohash = Geohash.encode(location_lat, location_lng);
        // console.log(location_lat, location_lng, "GEOCODE ===> ", Geohash.encode(location_lat, location_lng))
        pool.query('INSERT INTO merchants(username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30 ) RETURNING id', [
            username, email, store_name, store_hours_start, store_hours_end, location_full_address, store_description, phone_number, landline_number, place_id, location_lat, location_lng, category, geohash, monday_store_hours_start, monday_store_hours_end, tuesday_store_hours_start, tuesday_store_hours_end, wednesday_store_hours_start, wednesday_store_hours_end, thursday_store_hours_start, thursday_store_hours_end, friday_store_hours_start, friday_store_hours_end, saturday_store_hours_start, saturday_store_hours_end, sunday_store_hours_start, sunday_store_hours_end, store_logo_file_id, password
                ], (error, results) => {
            
                    if(error){
                        console.log(error);
                        return response.status(200).json({ 
                            success: false,
                            error_code: 102,
                            message: error.detail
                        });
                    }
                    if (results.rowCount) {
                        var merchant_id = results.rows[0].id;

                        var reset_pass_url = protocol+'://'+request.headers.host+'/reset-password/'+reset_password_token;
                        mail({email, reset_pass_url, store_name, username, type: "sign-up"}).catch(console.error);
                              
                          // Generate Token
                          var token = jwt.sign({ merchant_id: merchant_id }, config.secret, {
                          expiresIn: 0 // Token Generator
                          });
                          var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
                          pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], (error, tokenResult) => {
                              if(error){
                                  throw error
                              }
                              if(tokenResult.rowCount){
                                  return response.status(200).json({ 
                                      success: true,
                                      message: "Successfully signed up.",
                                      merchant_id: tokenResult.rows[0].merchant_id,
                                      token: tokenResult.rows[0].token
                                  });
                              }else{
                                  return response.status(200).json({ 
                                      success: false,
                                      message: "Invalid username/email or password"
                                  });
                              }
              
                          });
    
                    } else {
                        return response.status(200).json({ 
                            success: false,
                            message: "Invalid details."
                        });
                    }	
                });
    }


};

exports.validateCred = (request, response) => {

    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    var username = request.body.username;
    var email = request.body.email;


    pool.query('SELECT email, username FROM merchants WHERE username = $1 OR email = $2', [username, email], (error, results) => {
        if (results.rowCount) {
            if(results.rows[0].email == email){
                return response.status(200).json({ 
                    success: false,
                    message: "email is already exists."
                });
            }else{
                return response.status(200).json({ 
                    success: false,
                    message: "username is already exists."
                });
            }
        } else {
            return response.status(200).json({ 
                success: true,
                message: "email and username is valid."
            });
        }	
    });

};

exports.signOut = (request, response) => {

    var token = request.token;
    var dateTimeNow =  moment().format('YYYY-MM-DD HH:mm');

    pool.query('UPDATE merchants_auth_tokens SET expiry_date = $1 WHERE token = $2 RETURNING *', [dateTimeNow, token], (error, tokenResult) => {
        
        return response.status(200).json({ 
            success: true,
            message: "Merchant successfully logged out."
        });
    });
};

exports.resetPassword = (request, response) => {

    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    var password = request.body.password;
    var confirm_password = request.body.confirm_password;
    var token = request.body.token;

    if(password != confirm_password){
        return response.status(200).json({ 
            success: false,
            message: "password and confirm_password not same."
        });
    }

    var hashed_password = md5(password);
    pool.query('UPDATE merchants SET password = $1, reset_password_token = NULL WHERE reset_password_token = $2 RETURNING id', [hashed_password, token], (error, results) => {
        
        if(!results.rowCount){
            return response.status(200).json({ 
                success: false,
                message: "Invalid Token."
            });
        }else{
            var merchant_id = results.rows[0].id;
            // Generate Token
            var token = jwt.sign({ merchant_id: merchant_id }, config.secret, {
              expiresIn: 0 // Token Generator
            });
            var tokenExpirationDateTime =  moment().add(1, 'months').format('YYYY-MM-DD HH:mm');
            pool.query('INSERT INTO merchants_auth_tokens(token, merchant_id, expiry_date) VALUES($1, $2, $3) RETURNING *', [token, merchant_id, tokenExpirationDateTime], (error, tokenResult) => {
                
                if(tokenResult.rowCount){
                    return response.status(200).json({ 
                        success: true,
                        message: "Merchant's password successfully changed..",
                        token: tokenResult.rows[0].token
                    });
                }else{
                    return response.status(200).json({ 
                        success: false,
                        message: "Invalid username/email or password"
                    });
                }

            });
        }
    });
};

exports.forgotPassword = (request, response) => {

    // parameters validation
    const error = validationResult(request).array();
    if (error.length > 0) {
    response.status(200).json({ 
        success: false,
        message: error[0].msg});
    return;
    }

    var email = request.body.email;
    // Generate Token
    var token = jwt.sign({ merchant_id: email }, config.secret, {
      expiresIn: 0 // Token Generator
    });
    var reset_pass_url = protocol+'://'+request.headers.host+'/reset-password/'+token;
    pool.query('UPDATE merchants SET reset_password_token = $1 WHERE email = $2 RETURNING *', [token, email], (error, results) => {

        if(results.rowCount){
            var store_name = results.rows[0].store_name;
            mail({email, reset_pass_url, store_name, type: "forgot_password"}).catch(console.error);
            return response.status(200).json({ 
                success: true,
                message: "Reset Password link has been sent to your email."
            });
        }else{
            return response.status(200).json({ 
                success: false,
                message: "Email not registered."
            });
        }

    });
};