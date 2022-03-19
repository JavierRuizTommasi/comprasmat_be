const mongoose = require('mongoose')
const mailsToSuppliersSchema = require('./mailsToSuppliers.model')

mailsToSuppliersSchema.statics = {
    create: function (data, ub) {
        const mail = new this(data)
        mail.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
        .sort({updatedAt:-1})
    },
    getByID: function (query, ub) {
        this.find(query, ub)
    },
    update: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    } 
}

const mailsToSuppliersModel = mongoose.model('mailsToSuppliers', mailsToSuppliersSchema)
module.exports = mailsToSuppliersModel 