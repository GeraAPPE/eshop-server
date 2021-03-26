const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    esAdmin: {
        type: Boolean,
        default: false
    },
    calle: {
        type: String,
        default: '',
    },
    departamento: {
        type: String,
        default: ''
    },
    colonia: {
        type: String,
        default: ''
    },
    codigoPostal: {
        type: String,
        default: ''
    },
    ciudad: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: ''
    }
    
})

usuarioSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

module.exports = mongoose.model('Usuario', usuarioSchema);

