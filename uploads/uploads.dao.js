const mongoose = require('mongoose')
const uploadsSchema = require('./uploads.model')

uploadsSchema.statics = {
    create: function (data, ub) {
        const uploads= new this(data)
        uploads.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
    },
    getByID: function (query, ub) {
        this.find(query, ub)
    },
    update: function (query, updateData, ub) {
        // this.update(query, { $set: updateData }, { upsert: true }, ub)
        this.findOneAndUpdate(query, { $set: updateData }, { new: true, useFindAndModify: false }, ub)
    },
    delete: function(query, ub) {
        this.findOneAndDelete(query, ub)
    }
}

const uploadsModel = mongoose.model('uploads', uploadsSchema)
module.exports = uploadsModel 