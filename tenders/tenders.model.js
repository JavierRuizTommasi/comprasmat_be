const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tenderSchema = new Schema({
    licitacion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    finaliza: {
        type: Date,
        required: true
    },
    producto: {
        type: Number,
        required: true
    },
    descrip: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    unidad: {
        type: String,
        required: true
    },
    costo: {
        type: Number,
        required: true
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
    estado: {
        type: Number,
        required: true
    },
    offer: [{
     type: Schema.ObjectId,
     ref: 'Offers'
    }],
    historico: {
        type: Number
    },
    sugerida: {
        type: Number
    },
    send48: {
        type: Boolean
    },
    send72: {
        type: Boolean
    }
},
{
    timestamps: true
})

module.exports = tenderSchema