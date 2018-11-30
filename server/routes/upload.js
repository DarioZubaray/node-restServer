const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id

  //validar tipos
  let tiposValidos = ['producto', 'usuario'];
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `El tipo ${tipo} no es valido. Los tipos permitidos son ${tiposValidos}`
      }
    });
  }

  //validar archivo existente
  if(!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se subió ningun archivo!'
      }
    });
  }

  //validar extensiones
  let archivoSubido = req.files.archivo;
  let nombreCortado = archivoSubido.name.split('.');
  let extension = nombreCortado[nombreCortado.length -1];
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if(extensionesValidas.indexOf( extension ) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `La extension ${extension} no es valida. Las extensiones permitadas son ${ extensionesValidas }`
      }
    });
  }

  let nuevoNombreArchivo = `${ id }_${ new Date().getMilliseconds() }.${ extension }`;
  console.log(nuevoNombreArchivo);

  archivoSubido.mv(`uploads/${ tipo }/${ nuevoNombreArchivo }`, (err) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(tipo === 'usuario') {
      imagenUsuario(id, res, nuevoNombreArchivo);
    } else {
      imagenProducto(id, res, nuevoNombreArchivo);
    }
  });
});

function imagenUsuario(id, res, nuevoNombreArchivo){
  Usuario.findById(id, (err, usuarioDB) => {
    if(err){
      borrarArchivo(nuevoNombreArchivo, 'usuario');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!usuarioDB){
      borrarArchivo(nuevoNombreArchivo, 'usuario');
      return res.status(400).json({
        ok: false,
        err: {
          message: `El usuario ${id} no existe`
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuario');

    usuarioDB.img = nuevoNombreArchivo;

    usuarioDB.save( (err, usuarioGuardado) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nuevoNombreArchivo
      })
    });
  });
}

function imagenProducto(id, res, nuevoNombreArchivo){
  Producto.findById(id, (err, productoDB) => {
    if(err){
      borrarArchivo(nuevoNombreArchivo, 'producto');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoDB){
      borrarArchivo(nuevoNombreArchivo, 'producto');
      return res.status(400).json({
        ok: false,
        err: {
          message: `El producto ${id} no existe`
        }
      })
    }

    borrarArchivo(productoDB.img, 'producto');

    productoDB.img = nuevoNombreArchivo;

    productoDB.save( (err, productoGuardado) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        ok: true,
        producto: productoGuardado,
        img: nuevoNombreArchivo
      })
    });
  });
}

function borrarArchivo(nombreImagen, tipo){
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
  if(fs.existsSync( pathImagen )){
    console.log('borrando imagen anterior');
    fs.unlinkSync( pathImagen );
  }
}

module.exports = app;
