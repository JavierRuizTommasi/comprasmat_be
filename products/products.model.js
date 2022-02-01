const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
    codigo: {
        type: Number,
        required: true
    },
    descrip: {
        type: String,
        require: true
    },
    unidad: {
        type: String,
        required: true
    },
    rubro: {
        type: String,
        required: true
    },
    subrubro: {
        type: String
    },
    costo: {
        type: Number,
    },
    ultcompra: {
        type: Date
    },
    proveedor: {
        type: Number
    },
    provenom: {
        type: String
    },
    precio: {
        type: Number
    },
    activo: {
        type: Boolean,
        required: true
    },
    historico: { 
        type: Number 
    },
    detaeng: {
        type: String
    },
    rubroeng: {
        type: String
    },
    subrubeng: {
        type: String
    },
    caracteris: {
        type: String
    },
    caracteriseng: {
        type: String
    },
    rankcontrib: {
        type: Number
    },
    link: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = productsSchema