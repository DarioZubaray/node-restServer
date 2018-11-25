const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuario', (req, res) => {

  let desde = Number(req.query.desde) || 0;
  let hasta = Number(req.query.hasta) || 5;

  Usuario.find({}, 'nombre email img role estado google')
         .skip(desde)
         .limit(hasta)
         .exec((err, usuarios) => {
           if(err){
             return res.status(400).json({
               ok: false,
               err
             });
           }

           Usuario.count({}, (err, conteo) => {
             if(err){
               return res.status(400).json({
                 ok: false,
                 err
               });
             }
             res.json({
                 ok: true,
                 conteo,
                 usuarios
             });
           });
         });
});

app.post('/usuario', (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save( (err, usuarioDB) => {
    console.log('usuario save', err, usuarioDB);
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.delete('/usuario', (req, res) => {
  res.json('delete usuario');
});


module.exports = app;
