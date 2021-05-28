const mongoose = require('mongoose')
const userSchema = require('./users.model')

userSchema.statics = {
    create: function (data, ub) {
        const user = new this(data)
        user.save(ub)
    },
    get: function (query, ub) {
        this.find(query, ub)
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

const usersModel = mongoose.model('Users', userSchema)
module.exports = usersModel 