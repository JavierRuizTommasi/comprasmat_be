const Helps = require('./help.dao')

exports.createHelp = (req, res, next) => {
    const newHelp = req.body

    Helps.create(newHelp, (err, help) => {
        if (err && err.code === 11000) return res.send({ message: 'Help already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'Help created successfully'})
    })
} 

exports.getHelps = async (req, res, next) => {
    // console.log('Helps')
    await Helps.get({}, (err, helps) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({Helps: helps})
    })
}

exports.getHelp = (req, res, next) => {
    Helps.findOne({ _id: req.params.id }, (err, help) => {
        // if (err) res.json({ error: err })
        if (!help) {
            res.send({Help: {}})
        } else {
            res.json({Help: help})
        }
    })
}
  
exports.udpateHelp = (req, res, next) => {
    const Help = req.body

    Helps.updateOne({ _id: req.params.id }, Help, (err, help) => {
        if (err) res.json({ error: err})
        res.json({message: 'Help updated successfully'})        
    })
}

exports.deleteHelp = (req, res, next) => {
    Helps.delete({ _id: req.params.id }, (err, help) => {
        if (err) res.json({ error: err})
        res.json({message: 'Help deleted successfully'})
    })
}
