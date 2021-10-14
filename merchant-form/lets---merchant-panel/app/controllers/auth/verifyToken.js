const pool = require("../../models/db");
var moment = require('moment');

function verifyToken(request, response, next) {
  var token = request.headers.authorization;

  if (!token)
    return response.status(200).send({ auth: false, message: 'No token provided.' });
      
  var token = request.headers.authorization.replace('Bearer ', '');
  var dateTimeNow =  moment().format('YYYY-MM-DD HH:mm');
    pool.query('SELECT * FROM merchants_auth_tokens WHERE token = $1 and expiry_date > $2', [token, dateTimeNow], (error, results) => {
      if(results.rowCount){
        request.merchant_id = results.rows[0].merchant_id;
        request.token = token;
        next();
      }
      else //If Invalid Token
      return response.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
    });

}

module.exports = verifyToken;