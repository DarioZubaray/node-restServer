const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {

  Categoria.find({}, (err, categoriaDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.post('/categoria', verificaToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save( (err, categoriaDB) => {
    console.log('usuario save', err, categoriaDB);
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let descripcion = req.body.descripcion;

  Categoria.findByIdAndUpdate(id, descripcion, {new: true, runValidators: true}, (err, categoriaDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
     return res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;
  let categoria = {
    descripcion: req.body.descripcion,

  }

  Categoria.findByIdAndRemove(categoria, (err, categoriaBorrada) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if( !categoriaBorrada){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'categoria no encontrada'
        }
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaBorrada
    });
  });
});

module.exports = app;
