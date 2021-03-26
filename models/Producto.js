const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    descripcionLarga: {
        type: String,
        default: ''
    },
    imagen: {
        type: String,
        default: ''
    },
    imagenes: [{
        type: String,
    }],
    marca: {
        type: String,
        default: ''
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    calificacion: {
        type: Number,
        default: 0
    },
    numResenas: {
        type: Number,
        default: 0
    },
    esDestacado: {
        type: Boolean,
        default: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

productoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

module.exports = mongoose.model('Producto', productoSchema);
