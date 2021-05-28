const mongoose = require('mongoose')
const Schema = mongoose.Schema

const helpSchema = new Schema({
    orden: {
        type: Number
    },
    grupo: {
        type: String
    },
    grupoeng: {
        type: String
    },
    pregunta: {
        type: String,
    },
    preguntaeng: {
        type: String
    },
    respuesta: {
        type: String
    },
    respuestaeng: {
        type: String
    },
    activo: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

module.exports = helpSchema