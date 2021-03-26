const Pedido = require('../models/Pedido');
const express = require('express');
const ItemPedido = require('../models/Item-Pedido');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const listaPedido = await Pedido.find().populate('usuario', 'nombre').sort({'fechaPedido': -1});

    if(!listaPedido) {
        res.status(500).json({success: false})
    } 
    res.send(listaPedido);
});

router.get(`/:id`, async (req, res) =>{
    const pedido = await Pedido.findById(req.params.id)
    .populate('usuario', 'nombre')
    .populate({ 
        path: 'itemsPedido', populate: { 
            path: 'producto', populate: 'categoria' }
        });

    if(!pedido) {
        res.status(500).json({success: false})
    } 
    res.send(pedido);
});

router.post('/', async (req, res) => {

    const idsItemsPedido = Promise.all(req.body.itemsPedido.map(async itemPedido =>{
        let nuevoItemPedido = new ItemPedido({
            cantidad: itemPedido.cantidad,
            producto: itemPedido.producto
        });

        nuevoItemPedido = await nuevoItemPedido.save();

        return nuevoItemPedido._id;

    }));

    const idsItemsPedidoResuelto = await idsItemsPedido;

    const preciosTotales = await Promise.all(idsItemsPedidoResuelto.map(async (idItemPedido) => {
        const itemPedido = await ItemPedido.findById(idItemPedido).populate('producto', 'precio');

        const precioTotal = itemPedido.producto.precio * itemPedido.cantidad;

        return precioTotal;
    }));

    const precioTotal = preciosTotales.reduce((a,b) => a + b , 0);

    let pedido = new Pedido({
        itemsPedido: idsItemsPedidoResuelto,
        direccion1: req.body.direccion1,
        direccion2: req.body.direccion2,
        colonia: req.body.colonia,
        codigoPostal: req.body.codigoPostal,
        ciudad: req.body.ciudad,
        estado: req.body.estado,
        telefono: req.body.telefono,
        estatus: req.body.estatus,
        precioTotal: precioTotal,
        usuario: req.body.usuario,
    });

    pedido = await pedido.save();

    if (!pedido) {
        return res.status(404).send('El pedido no pudo ser creado');
    }

    res.send(pedido);
});

router.put('/:id', async (req, res) => {
    const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            {
                estatus: req.body.estatus,
            },
            {
                new: true
            }
        );

    if(!pedido) {
        res.status(500).json({message: 'El Pedido no se encontro'});
    }
    res.status(200).send(pedido);
});

router.delete('/:id', (req, res) => {
    Pedido.findByIdAndRemove(req.params.id)
        .then(async pedido => {
            if(pedido) {
                await pedido.itemsPedido.map(async itemPedido => {
                    await ItemPedido.findByIdAndRemove(itemPedido)
                });
                return res.status(200).json({success: true, message: 'Se elimino el pedido'});
            } else {
                return res.status(404).json({success: false, message: 'No se encontro el pedido'});
            }
        })
        .catch(err => {
            return res.status(400).json({success: false, error: err});
        })
});

router.get('/get/ventastotales', async (req, res) => {
    const ventasTotales = await Pedido.aggregate([
        {$group: { _id: null, ventasTotales: { $sum: '$precioTotal' }}}
    ]);

    if(!ventasTotales) {
        return res.status(400).send('No se puedo generar las Ventas Totales');
    }

    res.send({ventasTotales: ventasTotales.pop().ventasTotales});
});

router.get('/get/count', async (req, res) => {
    const totalPedidos = await Pedido.countDocuments((count) => count);

    if(!totalPedidos) {
        res.status(500).json({success: false});
    }
    res.send({
        totalPedidos
    });
});

router.get(`/get/pedidosusuario/:idusuario`, async (req, res) =>{
    const listaPedidosUsuario = await Pedido.find({usuario: req.params.idusuario}).populate({ 
        path: 'itemsPedido', populate: { 
            path: 'producto', populate: 'categoria' }
        }).sort({'fechaPedido': -1});

    if(!listaPedidosUsuario) {
        res.status(500).json({success: false})
    } 
    res.send(listaPedidosUsuario);
});




module.exports =router;