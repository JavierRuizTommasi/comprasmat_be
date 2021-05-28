const Upload = require('./uploads.dao')

const dbURL = require('../config/properties').DB
const mongoose = require('mongoose')
const conn = mongoose.createConnection(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })

var fs = require('fs')
var path = require('path')

// GridFs
let gfs;

conn.once('open', () => {
    // initialize stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

exports.createUploads = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `${req.files.length} files uploaded successfully`,
    });
}

exports.createUpload = (req, res, next) => {
    const newFile = req.body
    console.log('Create', newFile)

    // check for existing images
    Upload.findOne({})
        .then((upload) => {
            console.log(upload);
            // if (upload) {
            //     return res.status(200).json({
            //         success: false,
            //         message: 'upload already exists',
            //     });
            // }

            let newUpload = new Upload({
                fileType: req.body.fileType,
                originalName: req.body.originalName,
                filename: req.file.filename,
                fileId: req.file.id,
                usuario: req.body.usuario,
                offer: req.body.offer ? req.body.offer : 0
            });

            newUpload.save()
                .then((upload) => {
                    // console.log(upload)
                    res.status(200).json({Upload: upload});
                })
                .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));

} 

exports.download = (req, res, next) => {
    //  console.log(req.params._id)
     Upload.findOne({ _id: req.params._id }, (err, upload) => {
        // console.log(upload)
        if(upload) {
            gfs.find({ filename: upload.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({message: 'No files available'});
                }

                // if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                // if (files[0]) {
                    // render image to browser
                    // gfs.openDownloadStreamByName(upload.filename).pipe(res);

                    // let streamToDownloadTo = new FileOutputStream(upload.originalName)

                    // var file = path.join(__dirname, upload.originalName);
                    // var defPath = 'c:\tmp\' + upload.originalName
                    // console.log(defPath)

                    // gfs.openDownloadStreamByName(upload.filename)
                    // .pipe(fs.createWriteStream(upload.originalName))
                    // .on('error', ()=>{
                    //     console.log("Some error occurred in download:"+error);
                    //     res.send(error);
                    // })
                    // .on('finish', ()=>{
                    //     console.log("done downloading");
                    //     message = {file: upload.originalName}
                    //     res.send(message);
                    // });

                    gfs.openDownloadStreamByName(upload.filename, )
                    .pipe(res)
                    .on('error', ()=>{
                        console.log("Some error occurred in download:"+error);
                        res.send(error);
                    })
                    .on('finish', ()=>{
                        console.log("done downloading");
                        // message = {file: upload.originalName}
                        // res.send(message)
                        return
                    });

                // } else {
                //     res.status(404).json({
                //         err: 'Not an image',
                //     });
                // }
            });
        } else {
            return res.status(200).json({
                success: false,
                message: 'No files available',
            });
        }
    })
}
  
exports.getUploads = (req, res, next) => {
    // console.log('req')
    // Upload.find({})
    // .then(uploads => {
    //     res.status(200).send({Uploads: uploads});
    // })
    // .catch(err => res.status(500).send(err));

    Upload.get({}, (err, uploads) => {
        return new Promise((resolve) => { 
            let messaje = ''
            if (err) {
                message = 'Server error!'
            } else {
                // res.json({Users: users})
                message = {Uploads: uploads}
            }
            resolve(res.send(message))
        })       
    })

}

exports.getUpload = (req, res, next) => {
    Upload.findOne({ _id: req.params.id }, (err, upload) => {
        if (err) res.send({ error: err })
        res.send({Upload: upload})
    })
}
 
exports.udpateUpload = (req, res, next) => {
    const Upload = req.body

    Upload.update({ _id: req.params.id }, Upload, (err, upload) => {
        if (err) res.json({ error: err})
        res.json({message: 'Upload updated successfully'})        
    })
}

exports.deleteUpload = (req, res, next) => {

    console.log(req.params.id)
    Upload.findOne({ _id: req.params.id }, (err, upload) => {
        if (err) res.send({ error: err })
        if (upload) {
            console.log(upload.fileId)
            const obj_id = new mongoose.Types.ObjectId(upload.fileId)
            gfs.delete( obj_id );
            console.log('GF removed', upload.fileId)
        } else {
            console.log('GF not found')
        }
    })

    Upload.delete({ _id: req.params.id }, (err, upload) => {
        if (err) res.json({ error: err})
        res.json({message: 'Upload deleted successfully'})
    })
}


