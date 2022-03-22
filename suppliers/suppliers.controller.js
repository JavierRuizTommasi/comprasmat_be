const Suppliers = require('./suppliers.dao')
const Uploads = require('../uploads/uploads.dao')

exports.createSupplier = (req, res, next) => {
    const newSupplier = req.body

    Suppliers.create(newSupplier, (err, supplier) => {
        if (err && err.code === 11000) return res.send({ message: 'Supplier already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Supplier created successfully'})
    })
} 

exports.getSuppliers = (req, res, next) => {
    // console.log('Suppliers')
    Suppliers.get({}, (err, suppliers) => {
        return new Promise((resolve) => { 
            let messaje = ''
            if (err) {
                message = 'Server error!'
            } else {
                // res.json({Users: users})
                message = {Suppliers: suppliers}
            }
            resolve(res.send(message))
        })       
    })
}

exports.getSupplier = (req, res, next) => {
    Suppliers.findOne({ _id: req.params.id }, (err, supplier) => {
        if (err) res.json({ error: err })
        res.json({Supplier: supplier})
    })
}
  
exports.getMySupplier = (req, res, next) => {
    Suppliers.get({ usuario: req.params.usuario }, (err, supplier) => {
        if (err) res.json({ error: err })
        res.send({Supplier: supplier})
    })
}
  
exports.udpateSupplier = (req, res, next) => {
    const supplier = req.body

    Suppliers.updateOne({ _id: req.params.id }, supplier, (err, supplier) => {
        if (err) res.json({ error: err})
        res.json({message: 'Supplier updated successfully'})        
    })
}

exports.deleteSupplier = (req, res, next) => {

    Suppliers.delete({ _id: req.params.id }, (err, supplier) => {
        if (err) res.json({ error: err})
        res.json({message: 'Supllier deleted successfully'})
    })
}

exports.assignUpload = (req, res, next) => {
    // console.log(req.params)
    const upload = req.body
    // console.log(upload)

    Suppliers.assignUpload(
        { _id: req.params.id },
        { $push: { upload: upload._id } },
        (err, upload) => {
            if (err) res.json({ error: err})
        }
    )
    res.json({ upload: 'Upload updated successfully'}) 
}

exports.removeUpload = (req, res, next) => {
    // console.log(req.params)
    const upload = req.body
    console.log(upload)

    Suppliers.assignUpload(
        { _id: req.params.id },
        { $pull: { upload: upload._id } },
        (err, upload) => {
            if (err) res.json({ error: err})
        }
    )
    res.json({ upload: 'Upload removed successfully'}) 
}
