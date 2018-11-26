const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();

app.post('/login', (req, res) => {

  let body = req.body;

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!usuarioDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      });
    }

    if(!bcrypt.compareSync(body.password, usuarioDB.password)){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos'
        }
      });
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });

  });

});

async function verify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return{
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {
  console.log('Post google sign in');
  let token = req.body.idtoken;

  let googleUser = await verify(token)
        .catch(e => {
              console.log('error verify token', e);
              return res.status(403).json({
                  ok: false,
                  err: e
              });
        });

  Usuario.findOne({ email: googleUser.email}, (err, usuarioDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(usuarioDB) {
      console.log('usuario existente en la base');

      if(usuarioDB.google === false){
        console.log('Usuario local identificándose con google');
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe de usar su autenticación normal'
          }
        });
      } else {
        console.log('usuario google registrado... renovando token');
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      }
    } else {
      console.log('usuarioDB inexistente en la base');

      console.log('Creando usuario google en nuestra base de datos');
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.picture;
      usuario.google = true;
      usuario.password = ':)';
      console.log('usuario creado :)');

      usuario.save((err, usuarioDB) => {
        if(err){
          console.log('error al guardar');
          return res.status(500).json({
            ok: false,
            err
          });
        }
        console.log('generando token');
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN});
        console.log('retornando el estado-usuario-token');
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      });
    }
  });
});

module.exports = app;
