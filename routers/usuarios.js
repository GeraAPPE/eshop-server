const Usuario = require('../models/Usuario');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) =>{
    const listaUsuario = await Usuario.find().select('-passwordHash');

    if(!listaUsuario) {
        res.status(500).json({success: false})
    } 
    res.send(listaUsuario);
});

router.get('/:id', async (req, res) => {
    const usuario = await Usuario.findById(req.params.id).select('-passwordHash');

    if(!usuario) {
        res.status(500).json({message: 'El Usuario no se encontro'});
    }
    res.status(200).send(usuario);
});

router.post('/', async (req, res) => {
    let usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        telefono: req.body.telefono,
        esAdmin: req.body.esAdmin,
        calle: req.body.calle,
        departamento: req.body.departamento,
        codigoPostal: req.body.codigoPostal, 
        ciudad: req.body.ciudad, 
        estado: req.body.estado, 
    });

    usuario = await usuario.save();

    if (!usuario) {
        return res.status(404).send('El usuario no puedo ser creado');
    }

    res.send(usuario);
});

router.put('/:id',async (req, res)=> {

    const existeUsuario = await Usuario.findById(req.params.id);
    let nuevoPassword
    if(req.body.password) {
        nuevoPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        nuevoPassword = existeUsuario.passwordHash;
    }

    const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            email: req.body.email,
            passwordHash: nuevoPassword,
            telefono: req.body.telefono,
            esAdmin: req.body.esAdmin,
            calle: req.body.calle,
            departamento: req.body.departamento,
            codigoPostal: req.body.codigoPostal,
            ciudad: req.body.ciudad,
            estado: req.body.estado,
        },
        { new: true}
    )

    if(!usuario)
    return res.status(400).send('No se encontro el usuario')

    res.send(usuario);
});

router.post('/login', async (req, res) => {
    const usuario = await Usuario.findOne({email: req.body.email});
    const secreta = process.env.secreta;

    if(!usuario) {
        return res.status(400).send('No se encontro el usuario');
    }

    if(usuario && bcrypt.compareSync(req.body.password, usuario.passwordHash)) {

        const token = jwt.sign(
            {
                usuarioId: usuario.id,
                esAdmin: usuario.esAdmin
            },
            secreta,
            {
                expiresIn: '1d'
            }
        )

        res.status(200).send({usuario: usuario.email, token: token});

    } else {
        res.status(400).send('El password es incorrecto');
    }


});

router.post('/register', async (req,res)=>{
    let usuario = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        telefono: req.body.telefono,
        esAdmin: req.body.esAdmin,
        calle: req.body.calle,
        departamento: req.body.departamento,
        codigoPostal: req.body.codigoPostal,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
    })
    usuario = await usuario.save();

    if(!usuario)
    return res.status(400).send('El usuario no pudo ser creado')

    res.send(usuario);
});

router.delete('/:id', (req, res) => {
    Usuario.findByIdAndRemove(req.params.id)
        .then(usuario => {
            if(usuario) {
                return res.status(200).json({success: true, message: 'Se elimino el usuario'});
            } else {
                return res.status(404).json({success: false, message: 'No se encontro el usuario'});
            }
        })
        .catch(err => {
            return res.status(400).json({success: false, error: err});
        })
});


router.get('/get/count', async (req, res) => {
    const totalUsuarios = await Usuario.countDocuments((count) => count);

    if(!totalUsuarios) {
        res.status(500).json({success: false});
    }
    res.send({
        totalUsuarios
    });
});



module.exports = router;