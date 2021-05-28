const mongoose = require('mongoose')
const Schema = mongoose.Schema

const uploadsSchema = new Schema({
    fileType: {
        required: true,
        type: String,
    },
    originalName: {
        type: String,
        require: true
    },
    filename: {
        type: String,
        require: true
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    usuario: {
        type: String,
        required: true
    },
    offer: {
        type: Number
    }
},
{
    timestamps: true
})

module.exports = uploadsSchema