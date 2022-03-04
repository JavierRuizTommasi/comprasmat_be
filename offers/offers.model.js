const mongoose = require('mongoose')
const Schema = mongoose.Schema

const offersSchema = new Schema({
    oferta: {
        type: Number,
        require: true
    },
    licitacion: {
        type: String,
        require: true
    },
    licitacion_id: {
        type: String
    },
    usuario: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
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
    },
    precio: {
        type: Number
    },
    incoterm: {
        type: String,
        required: true
    },
    entrega: {
        type: Number,
        required: true 
    },
    estado: {
        type: Number,
        required: true
    },
    detalle: {
        type: String
    },
    scoreProveedor: {
        type: Number
    },
    scorePrecio: {
        type: Number
    },
    scoreEntrega: {
        type: Number
    },
    scoreCantidad: {
        type: Number
    },
    scoring: {
        type: Number
    },
    financiacion: {
        type: Number,
        required: true
    },
    scoreFinanciacion: {
        type: Number
    },
    scoreRanking: {
        type: Number
    },
    precioPesos: {
        type: Number
    },
    cotizacion: {
        type: Number
    },
    desempeno: {
        type: Number
    },
    upload: [{
        type: Schema.ObjectId,
        ref: 'Uploads'
    }],
    observacion: {
        type: String
    },
    lugarEntrega: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = offersSchema