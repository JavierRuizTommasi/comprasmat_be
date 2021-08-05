const mongoose = require('mongoose')
const myProductsSchema = require('./myproducts.model')

myProductsSchema.statics = {
    create: function (data, ub) {
        const myproduct= new this(data)
        myproduct.save(ub)
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
    },
    insert: function (updateData, ub) {
        this.insertMany(updateData, { ordered: false }, ub)
    },
    deleteMany: function (query, ub) {
        this.remove(query, ub)
    }

}

const myProductsModel = mongoose.model('myProducts', myProductsSchema)
module.exports = myProductsModel
