const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingScoringsSchema = new Schema({
    codigo: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        require: true
    },
    peso: {
        type: Number,
        required: true
    },
    variable: {
        type: String,
        require: true
    },
    activo: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

module.exports = settingScoringsSchema