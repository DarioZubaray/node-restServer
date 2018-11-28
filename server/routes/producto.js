const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

/* obtener todos productos */
app.get('/productos', verificaToken, (req, res) => {
  //populate, usuario, categoria
  //paginado
  let desde = Number(req.query.desde) || 0;
  let hasta = Number(req.query.hasta) || 5;
  let disponibles = {
    disponible: true
  };

  Producto.find(disponibles).skip(desde).limit(hasta)
    .sort('nombre').populate('usuario', 'nombre email').populate('categoria')
    .exec((err, productoDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Producto.count(disponibles, (err, conteo) => {
        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }

        return res.json({
            ok: true,
            conteo,
            producto: productoDB
        });
      });

  });
});

/* obtener un producto por id */
app.get('/productos', verificaToken, (req, res) => {
  //populate, usuario, categoria
  let id = {
    _id: req.params.id
  };
  Categoria.find(id).sort('nombre').populate('usuario', 'nombre email').populate('categoria')
    .exec((err, productoDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if(!productoDB) {
        return res.json({
          ok: false,
          err:{
            message: 'No se encontro el producto'
          }
        })
      }

      return res.json({
        ok: true,
        produtcto: productoDB
      });
  });

});

/* crear un producto */
app.post('/productos', verificaToken, (req, res) => {
  //grabar el usuario, categoria
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id
  });

  producto.save((err, productoDB) => {
    console.log('producto save', err, productoDB);
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      producto: productoDB
    });
  });
});

//actualizar un producto por id
app.put('/productos/:id', verificaToken, (req, res) => {
  //populate, usuario, categoria
  let id = req.params.id;
  let body = req.body;

  let productoActualizado = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
  };

  Producto.findByIdAndUpdate(id, productoActualizado, {new: true, runValidators: true}, (err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      producto: productoDB
    });
  });
});

//borrar un producto por id
app.delete('/productos/:id', verificaToken, (req, res) => {
  //disponible = false
  let id = req.params.id;
  let productoActualizado = {
    disponible: false
  }

  Producto.findByIdAndUpdate(id, productoActualizado, {new: true, runValidators: true}, (err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      message: 'Producto eliminado'
    });
  });

});

module.exports = app;
