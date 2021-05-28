const mongoose = require('mongoose')
const tenderSchema = require('./tenders.model')

tenderSchema.statics = {
    create: function (data, ub) {
        const tender = new this(data)
        tender.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
        .sort({updatedAt:-1})
        .populate("offer")
    },
    getByID: function (query, ub) {
        this.find(query, ub)
        .populate("offer")
    },
    update: function (query, updateData, ub) {
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    },
    assignOffer: function(query, updateData, ub) {
        this.findOneAndUpdate(query, updateData, { new: true, useFindAndModify: false }, ub)
    } 
}

const tendersModel = mongoose.model('Tenders', tenderSchema)
module.exports = tendersModel 