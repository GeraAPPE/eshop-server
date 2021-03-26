const Categoria = require('../models/Categoria');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const listaCategoria = await Categoria.find();

    if(!listaCategoria) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(listaCategoria);
});

router.get('/:id', async (req, res) => {
    const categoria = await Categoria.findById(req.params.id);

    if(!categoria) {
        res.status(500).json({message: 'La Categoria no se encontro'});
    }
    res.status(200).send(categoria);
});

router.post('/', async (req, res) => {
    let categoria = new Categoria({
        nombre: req.body.nombre,
        icono: req.body.icono,
        color: req.body.color 
    });

    categoria = await categoria.save();

    if (!categoria) {
        return res.status(404).send('La categoria no puedo ser creada');
    }

    res.send(categoria);
});

router.put('/:id', async (req, res) => {
    const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                icono: req.body.icono,
                color: req.body.color,
                imagen: req.body.imagen
            },
            {
                new: true
            }
        );

    if(!categoria) {
        res.status(500).json({message: 'La Categoria no se encontro'});
    }
    res.status(200).send(categoria);
});

router.delete('/:id', (req, res) => {
    Categoria.findByIdAndRemove(req.params.id)
        .then(categoria => {
            if(categoria) {
                return res.status(200).json({success: true, message: 'Se elimino categoria'});
            } else {
                return res.status(404).json({success: false, message: 'No se encontro la categoria'});
            }
        })
        .catch(err => {
            return res.status(400).json({success: false, error: err});
        })
});

module.exports =router;

