const mongoose = require('mongoose')
const samplesSchema = require('./samples.model')

const AutoIncrement = require('mongoose-sequence')(mongoose)
samplesSchema.plugin(AutoIncrement, {inc_field: 'muestra', disable_hooks: false})

samplesSchema.statics = {
    create: function (data, ub) {
        const sample = new this(data)
        sample.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
    },
    getByID: function (query, ub) {
        this.find(query, ub)
    },
    update: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    } 
}

const samplesModel = mongoose.model('Samples', samplesSchema)
module.exports = samplesModel 