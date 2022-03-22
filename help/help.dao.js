const mongoose = require('mongoose')
const helpSchema = require('./help.model')

helpSchema.statics = {
    create: function (data, ub) {
        const product= new this(data)
        product.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
        .sort({orden: 1})
    },
    getByID: function (query, ub) {
        this.find(query, ub)
    },
    updateOne: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    } 
}

const helpModel = mongoose.model('Help', helpSchema)
module.exports = helpModel 