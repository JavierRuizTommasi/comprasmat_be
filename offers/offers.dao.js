const mongoose = require('mongoose')
const offersSchema = require('./offers.model')

const AutoIncrement = require('mongoose-sequence')(mongoose)
offersSchema.plugin(AutoIncrement, {inc_field: 'oferta', disable_hooks: false})

offersSchema.statics = {
    create: function (data, ub) {
        const offer= new this(data)
        offer.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
    },
    getByID: function (query, ub) {
        this.find(query, ub)
    },
    updateOne: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    }, 
    assignUpload: function(query, updateData, ub) {
        this.findOneAndUpdate(query, updateData, { new: true, useFindAndModify: false }, ub)
    }  
}

const offersModel = mongoose.model('Offers', offersSchema)
module.exports = offersModel 