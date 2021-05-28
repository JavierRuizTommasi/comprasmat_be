const mongoose = require('mongoose')
const Schema = mongoose.Schema
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new Schema({
    usuario: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [emailRegex, "Please enter a valid email address"],
        unique: true,
        trim: true
    }, 
    pass: {
        type: String,
        required: true
    },
    perfil: {
        type: Number,
        required: true
    },
    proveedor: {
        type: Number,
        required: false
    },
    contacto: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        require: false
    },
    ciudad: {
        type: String,
        require: false
    },
    pais: {
        type: String,
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    activo: {
        type: Boolean,
        required: true
    },
    language: {
        type: String,
        require: false
    },
    contacto2: {
        type: String,
        require: false
    },
    email2: {
        type: String,
        require: false,
        trim: true
    },
    contacto3: {
        type: String,
        require: false
    },
    email3: {
        type: String,
        require: false,
        trim: true
    },
    contacto4: {
        type: String,
        require: false
    },
    email4: {
        type: String,
        require: false,
        trim: true
    },
    CUIT: {
        type: String,
        require: false
    }
},
{
    timestamps: true
})

module.exports = userSchema