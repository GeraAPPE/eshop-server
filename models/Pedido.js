const mongoose = require('mongoose');
const Usuario = require('./Usuario');

const pedidoSchema = mongoose.Schema({
    itemsPedido: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemPedido',
        required: true
    }],
    direccion1: {
        type: String,
        required: true
    },
    direccion2: {
        type: String,
    },
    colonia: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    estatus: {
        type: String,
        required: true,
        default: 'Pendiente'
    },
    precioTotal: {
        type: Number
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fechaPedido: {
        type: Date,
        default: Date.now
    }
});

pedidoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

module.exports = mongoose.model('Pedido', pedidoSchema);
