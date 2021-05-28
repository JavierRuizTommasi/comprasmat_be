const Samples = require('./samples.dao')

exports.createSamples = (req, res, next) => {
    const newSample = {
        muestra: req.body.muestra,
        usuario: req.body.usuario,
        email: req.body.email,
        proveedor: req.body.proveedor,
        provenom: req.body.provenom,
        fecha: req.body.fecha,
        producto: req.body.producto,
        descrip: req.body.descrip,
        cantidad: req.body.cantidad,
        unidad: req.body.unidad,
        analisis: req.body.analisis,
        userlab: req.body.userlab,
        resultado: req.body.resultado,
        estado: req.body.estado,
        detalle: req.body.detalle
      }
    
      console.log(newSample)
      
      Samples.create(newSample, (err, samples) => {
        if (err && err.code === 11000) return res.send({ message: 'Sample already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Sample created successfully'})
    })
} 

exports.getSamples = (req, res, next) => {
    // console.log('Samples')
    Samples.get({}, (err, samples) => {
        return new Promise((resolve) => { 
            let messaje = ''
            if (err) {
                message = 'Server error!'
            } else {
                // res.json({Users: users})
                message = {Samples: samples}
            }
            resolve(res.send(message))
        })
    })
}

exports.getSample = (req, res, next) => {
    Samples.findOne({ _id: req.params.id }, (err, sample) => {
        if (err) res.json({ error: err })
        res.json({Sample: sample})
    })
}
  
exports.udpateSamples = (req, res, next) => {
    const Sample = {
        muestra: req.body.muestra,
        usuario: req.body.usuario,
        email: req.body.email,
        proveedor: req.body.proveedor,
        provenom: req.body.provenom,
        fecha: req.body.fecha,
        producto: req.body.producto,
        descrip: req.body.descrip,
        cantidad: req.body.cantidad,
        unidad: req.body.unidad,
        analisis: req.body.analisis,
        userlab: req.body.userlab,
        resultado: req.body.resultado,
        estado: req.body.estado,
        detalle: req.body.detalle
    }
    
    Samples.update({ _id: req.params.id }, Sample, (err, sample) => {
        if (err) res.json({ error: err})
        res.json({message: 'Sample updated successfully'})        
    })
}

exports.deleteSamples = (req, res, next) => {
    Samples.delete({ _id: req.params.id }, (err, sample) => {
        if (err) res.json({ error: err})
        res.json({message: 'Sample deleted successfully'})
    })
}

exports.findMySamples = (req, res, next) => {
    // console.log('Samples')
    Samples.get({ usuario: req.params.usuario }, (err, samples) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({Samples: samples})
    })
}
