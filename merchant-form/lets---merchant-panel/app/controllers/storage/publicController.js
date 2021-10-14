const pool = require("../../../app/models/db");

// Variables
const variables = require("../../config/variables.config");
const max_upload_file_size = variables.max_upload_file_size;
const appVersion = variables.appVersion;
const api_url = variables.api_url;

var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './../api.lets.com/app/controllers/storage/assets/files');
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    } else if (file.mimetype === 'image/png') {
      filetype = 'png';
    } else if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    } else if (file.mimetype === 'image/jpg') {
      filetype = 'jpg';
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      filetype = 'docx';
    } else if (file.mimetype === 'application/pdf') {
      filetype = 'pdf';
    }

    cb(null, 'file-' + Date.now() + '.' + filetype);

  },

});
var singleUpload = multer({ storage: storage, limits: { fileSize: max_upload_file_size } }).single('file');

exports.uploadFile = (req, res) => {

  if(req.headers['content-length'] > max_upload_file_size){
   return res.status(200).send({
     error: true,
     message: "File too large",
     code: "LIMIT_FILE_SIZE",
   });
  }
 
  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(200).send({
        error: true,
        message: err
      });
    } else if (err) {
      return res.status(200).send({
        error: true,
        message: err
      });
    }
 
    // Everything went fine.
    
  if(!req.file) {
    return res.status(200).send({
      error: true,
      message: "Please select file."
    });
  }

  if(req.file.mimetype !== 'image/gif'
  && req.file.mimetype !== 'image/png'
  && req.file.mimetype !== 'image/jpeg'
  && req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  && req.file.mimetype !== 'application/pdf'
  ) {
    const path = './app/controllers/storage/assets/files/'+req.file.filename;

    var original_name = req.file.originalname;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    return res.status(200).send({
      error: true,
      message: "File type must be png, jpg, jpeg, gif, docx, or pdf.",
      file_sent: original_name
    });
  }
  var base_url = api_url+'/'+appVersion;
  var file_url = '/public/files/'+req.file.filename;
  
  pool.query('INSERT into file_uploads(file_url) VALUES($1) RETURNING *', [ file_url ], (error, results) => {
    if (error)
    return res.status(200).send({
      error: true,
      message: "Invalid details."
    });

    if(results.rowCount){
    
      var file_url = '/public/files/'+results.rows[0].id;
      return res.status(200).send({
        error: false,
        file_id: results.rows[0].id,
        file_url: base_url+file_url
      });
    }else
          return res.status(200).send({
            error: true,
            message: "Invalid details."
          });
  });
  })
};