const Producto = require('../models/Producto');
const express = require('express');
const Categoria = require('../models/Categoria');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
mongoose.set('useFindAndModify', false);

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Tipo de imegen invalido');

        if(isValid){
            uploadError = null
        }

        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  });
  
const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {

    let filter = {};
    if(req.query.categorias) {
        filter = {categoria: req.query.categorias.split(',')};
    }

    const listaProductos = await Producto.find(filter).populate('categoria'); 

    if(!listaProductos) {
        res.status(500).json({success: false});
    }
    res.send(listaProductos);
});

router.get('/:id', async (req, res) => {
    const producto = await Producto.findById(req.params.id).populate('categoria'); 

    if(!producto) {
        res.status(500).json({success: false});
    }
    res.send(producto);
});

router.post(`/`, uploadOptions.single('imagen'), async (req, res) => {

    const categoria = await Categoria.findById(req.body.categoria);

    if(!categoria) return res.status(400).send('Categoria invalida');

    const file = req.file;
    if(!file) return res.status(400).send('No se encontro foto del producto');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let producto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        descripcionLarga: req.body.descripcionLarga,
        imagen: `${basePath}${fileName}`,
        marca: req.body.marca,
        precio: req.body.precio,
        categoria: req.body.categoria,
        stock: req.body.stock,
        calificacion: req.body.calificacion,
        numResenas: req.body.numResenas,
        esDestacado: req.body.esDestacado,
    });

    producto = await producto.save();

    if (!producto)
        return res.status(500).send('El producto no puedo ser creado')

    res.send(producto);
});

router.put('/:id', uploadOptions.single("imagen"), async (req, res) => {
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Id de producto invalido');
    }

    const file = req.file;
    const categoria = await Categoria.findById(req.body.categoria);

    if(!categoria)
        return res.status(400).send('Categoria invalida');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            descripcionLarga: req.body.descripcionLarga,
            imagen: `${basePath}${fileName}`,
            marca: req.body.marca,
            precio: req.body.precio,
            categoria: req.body.categoria,
            stock: req.body.stock,
            calificacion: req.body.calificacion,
            numResenas: req.body.numResenas,
            esDestacado: req.body.esDestacado,
        },
        {
            new: true
        }
    );

    if(!producto) {
        res.status(500).json({message: 'El producto no se actualizo'});
    }
    res.status(200).send(producto);
});

router.delete('/:id', (req, res) => {
    Producto.findByIdAndRemove(req.params.id)
        .then(producto => {
            if(producto) {
                return res.status(200).json({success: true, message: 'Se elimino el producto'});
            } else {
                return res.status(404).json({success: false, message: 'No se encontro el producto'});
            }
        })
        .catch(err => {
            return res.status(400).json({success: false, error: err});
        })
});

router.get('/get/count', async (req, res) => {
    const totalProductos = await Producto.countDocuments((count) => count);

    if(!totalProductos) {
        res.status(500).json({success: false});
    }
    res.send({
        totalProductos
    });
});

router.get('/get/featured/:count', async (req, res) => {
    const contar = req.params.count ? req.params.count : 0
    const productos = await Producto.find({esDestacado: true}).limit(+contar);

    if(!productos) {
        res.status(500).json({success: false});
    }
    res.send(productos);
});

router.put('/imagenes-galeria/:id', uploadOptions.array('imagenes', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Id de producto invalido');
    }

    const files = req.files;
    let rutasImagenes = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files) {
        files.map(file => {
            rutasImagenes.push(`${basePath}${file.filename}`);
        });
    }

    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        {
            imagenes: rutasImagenes,
        },
        {
            new: true
        }
    );


    if (!producto)
        return res.status(500).send('El producto no puedo ser creado')

    res.send(producto);
})

module.exports = router;