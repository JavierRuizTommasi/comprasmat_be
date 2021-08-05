const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mailsToSuppliersSchema = new Schema({
    licitacion: {
        type: String,
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
    fecha: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    proveedor: {
        type: Number,
        required: true
    },
    provenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    from: {type: String},
    to: {type: String},
    bcc: {type: String},
    subject: {type: String}
},
{
    timestamps: true
})

module.exports = mailsToSuppliersSchema