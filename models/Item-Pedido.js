const mongoose = require('mongoose');

const itemPedidoSchema = mongoose.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
    }
});

module.exports = mongoose.model('ItemPedido', itemPedidoSchema);