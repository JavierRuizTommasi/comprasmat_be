const mongoose = require('mongoose')
const Schema = mongoose.Schema

const samplesSchema = new Schema({
    muestra: {
        type: Number
    },
    usuario: {
        type: String
    },
    email: {
        type: String
    },
    proveedor: {
        type: Number
    },
    provenom: {
        type: String
    },
    fecha: {
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
    analisis: {
        type: Date
    },
    userlab: {
        type: String
    },
    resultado: {
        type: Number
    },
    estado: {
        type: Number,
        required: true
    },
    detalle: {
        type: String
    }

},
{
    timestamps: true
})


module.exports = samplesSchema