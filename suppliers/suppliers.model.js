const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Uploads = require('../uploads/uploads.model')

const suppliersSchema = new Schema({
    codigo: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        require: true
    },
    usuario: {
        type: String,
        require: true
    },
    domicilio: {
        type: String
    },
    telefono: {
        type: String
    },
    c_postal: {
        type: Number
    },
    localidad: {
        type: String
    },
    provincia: {
        type: String
    },
    pais: {
        type: String
    },
    desempeno: {
        type: Number
    },
    ultcompra: {
        type: Date
    },
    upload: [{
     type: Schema.ObjectId,
     ref: 'Uploads'
    }],
    activo: {
        type: Boolean,
        required: true
    },
    fantasia: {
        type: String
    },
    actividad: {
        type: String
    },
    correspondencia: {
        type: String
    },
    cuentacbu: {
        type: String
    },
    CUIT: {
        type: String
    },
    IIBB: {
        type: String
    },
    retIIBBSF: {
        type: Boolean
    },
    aliretIIBBSF: {
        type: Number
    },
    motiexenIIBBSF: {
        type: String
    },
    retIIBBMI: {
        type: Boolean
    },
    aliretIIBBMI: {
        type: Number
    },
    motiexenIIBBMI: {
        type: String
    },
    retGAN: {
        type: Boolean
    },
    aliretGAN: {
        type: Number
    },
    motiexenGAN: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = suppliersSchema