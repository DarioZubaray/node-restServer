const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');

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

    imagenUsuario(id, res, nuevoNombreArchivo);
    // return res.json({
    //   ok: true,
    //   message: 'Archivo subido correctamente!',
    //   archivoRecibido: archivoSubido.name
    // })
  });
});

function imagenUsuario(id, res, nuevoNombreArchivo){
  Usuario.findById(id, (err, usuarioDB) => {
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
          message: `El usuario ${id} no existe`
        }
      })
    }
    console.log(usuarioDB);
    usuarioDB.img = nuevoNombreArchivo;
    console.log(usuarioDB);

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
function imagenProducto(id){

}

module.exports = app;
