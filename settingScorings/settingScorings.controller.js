const SettingScorings = require('./settingScorings.dao')

exports.createSettingScoring = (req, res, next) => {
    const newSettingScoring = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        peso: req.body.peso,
        variable: req.body.variable,
        activo: req.body.activo
      }

    SettingScorings.create(newSettingScoring, (err, settingScoring) => {
        if (err && err.code === 11000) return res.send({ message: 'SettingScoring already exists' })
        if (err) res.json({errr: err})
        res.json({ message: 'SettingScoring created successfully'})
    })
} 

exports.getSettingScorings = (req, res, next) => {
    // console.log('SettingScoring')
    SettingScorings.get({}, (err, settingScorings) => {
        if (err) res.json({ error: err})
        // res.json({Users: users})
        res.send({SettingScorings: settingScorings})
    })
}

exports.getSettingScoring = (req, res, next) => {
    SettingScorings.findOne({ _id: req.params.id }, (err, settingScoring) => {
        if (err) res.json({ error: err })
        res.json({SettingScoring: settingScoring})
    })
}
  
exports.udpateSettingScoring = (req, res, next) => {
    const SettingScoring = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        peso: req.body.peso,
        variable: req.body.variable,
        activo: req.body.activo
    }

    SettingScorings.updateOne({ _id: req.params.id }, SettingScoring, (err, settingScoring) => {
        if (err) res.json({ error: err})
        res.json({message: 'SettingScoring updated successfully'})        
    })
}

exports.deleteSettingScoring = (req, res, next) => {
    SettingScorings.delete({ _id: req.params.id }, (err, settingScoring) => {
        if (err) res.json({ error: err})
        res.json({message: 'SettingScoring deleted successfully'})
    })
}
