const mongoose = require('mongoose');

const categoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    icono: {
        type: String,
        default: ''
    },
    imagen: {
        type: String,
        default: ''
    }
});

categoriaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

module.exports = mongoose.model('Categoria', categoriaSchema);
