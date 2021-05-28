const mongoose = require('mongoose')
const Schema = mongoose.Schema

const myProductsSchema = new Schema({
    usuario: {
        type: String,
        required: true
    },
    proveedor: {
        type: Number
    },
    codigo: {
        type: Number,
        required: true
    },
    descrip: {
        type: String
    },
    rubro: {
        type: String
    },
    subrubro: {
        type: String
    },
    detaeng: {
        type: String
    },
    rubroeng: {
        type: String
    },
    subrubeng: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = myProductsSchema