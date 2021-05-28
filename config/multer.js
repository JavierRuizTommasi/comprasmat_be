const multer = require('multer')
const sftpStorage = require('multer-sftp')
const uuid = require('uuid').v4
const path = require('path')

// console.log(properties.URLHOME + '/uploads')

// Init file upload
// multer.diskStorage({
//     destination: properties.URLHOME + '/uploads',
//     filename: (req, file, cb) => {
//         cb(null, uuid() + path.extname(file.originalname))
//         }
//     })

exports.newFileUpload  =  function(req , res , next){     
       var storage = sftpStorage({
         sftp: {
           host: 'ftp://c1650961.ferozo.com/storagedir/',
           port: 22,
           username: 'C1650961',
           password: '55wuguboZE'

         },
         destination: function (req, file, cb) {
           cb(null, 'uploads')
         },
         filename: function (req, file, cb) {
        //    cb(null, uuid() + path.extname(file.originalname))
            cb(null, file.originalname)
         }
       })

       var upload = multer({ storage: storage }).array('file');

    //    upload(req,res,function(err){
    //        logger.debug(JSON.stringify(req.body));
    //              logger.debug(JSON.stringify(req.files));
    //          if(err){
    //               logger.debug("Error Occured", JSON.stringify(err));
    //               res.json({error_code:1,err_desc:err});
    //          } else{
    //               logger.debug("Files uploaded successfully");
    //              res.json({error_code:0,err_desc:null});
    //          }
    //      });
}

