const mongoose = require('mongoose')
const settingScoringsSchema = require('./settingScorings.model')

settingScoringsSchema.statics = {
    create: function (data, ub) {
        const settingScoring = new this(data)
        settingScoring.save(ub)
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

const settingScoringsModel = mongoose.model('settingScorings', settingScoringsSchema)
module.exports = settingScoringsModel 