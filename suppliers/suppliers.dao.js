const mongoose = require('mongoose')
const suppliersSchema = require('./suppliers.model')

suppliersSchema.statics = {
    create: function (data, ub) {
        const supplier = new this(data)
        supplier.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
        .sort({codigo:1})
        .populate("uploads")
    },
    getByID: function (query, ub) {
        this.find(query, ub)
        .populate("uploads")
    },
    update: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    }, 
    assignUpload: function(query, updateData, ub) {
        this.findOneAndUpdate(query, updateData, { new: true, useFindAndModify: false }, ub)
    } 
}

const suppliersModel = mongoose.model('Suppliers', suppliersSchema)
module.exports = suppliersModel 