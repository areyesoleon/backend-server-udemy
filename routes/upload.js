//Inclusiones
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

//Middlewares
app.use(fileUpload());

//Modelos
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

//Metodos
app.put('/:tipo/:id', (req, res, next) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  //tipos de collecciones
  const tiposValidos = ['hospitales', 'usuarios', 'medicos'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de coleccion no valida',
      errors: { message: 'Tipo de coleccion no valida' }
    });
  }
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No subio archivo',
      errors: { message: 'Debe de seleccionar una imagen' }
    });
  }
  const archivo = req.files.imagen;
  const nombreCortado = archivo.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no valida',
      errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
    });
  }
  //Nombre del archivo
  const nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

  //Mover el archivo del temporal a un path
  const path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover arhcivo',
        errors: err
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      const pathViejo = './uploads/usuarios/' + usuario.img;
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password = ':)';
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizado',
          usuarioActualizado: usuarioActualizado
        });
      });
    });
  }
  if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      const pathViejo = './uploads/medicos/' + medico.img;
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      medico.img = nombreArchivo;
      medico.save((err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de medico actualizado',
          medicoActualizado: medicoActualizado
        });
      });
    });
  }
  if (tipo === 'hospitales') {
    Hospital.findById(id, (err, hospital) => {
      const pathViejo = './uploads/hospitales/' + hospital.img;
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }
      hospital.img = nombreArchivo;
      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de hospital actualizado',
          ussuarioActualizado: hospitalActualizado
        });
      });
    });
  }
}

module.exports = app;