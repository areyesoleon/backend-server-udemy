const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

//===================================
// Busqueda por coleccion
//===================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
  const busqueda = req.params.busqueda;
  const tabla = req.params.tabla;
  const regex = new RegExp(busqueda, 'i');
  let promesa;
  switch (tabla) {
    case 'usuarios':
      promesa = buscarUsuario(busqueda, regex);
      break;
    case 'medicos':
      promesa = buscarMedicos(busqueda, regex);
      break;
    case 'hospitales':
      promesa = buscarHospitales(busqueda, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensajes: 'Los tipos de busqueda son solo usuarios, medicos, hospitales',
        error: { message: 'Tabla de coleccion no valido' }
      });
  }
  promesa.then((data) => {
    res.status(200).json({
      ok: true,
      [tabla]: data
    });
  });
});

//===================================
// Busqueda general
//===================================
app.get('/todo/:busqueda', (req, res) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');

  Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuario(busqueda, regex)])
    .then(respuestas => {
      res.status(200).json({
        ok: true,
        hospitales: respuestas[0],
        medicos: respuestas[1],
        usuarios: respuestas[2]
      });
    })
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex }).populate('usuario', 'nombre email img').exec((err, hospitales) => {
      if (err) {
        reject('Error al cargar hospitales', err);
      } else {
        resolve(hospitales);
      }
    });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate('usuario', 'nombre email img')
      .populate('hospital')
      .exec((err, medicos) => {
        if (err) {
          reject('Error al cargar medicos', err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuario(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, 'nombre email role img')
      .or([{ 'nombre': regex }, { 'email': regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject('Errro al cargar usuario', err)
        } else {
          resolve(usuarios)
        }
      });
  });
}

module.exports = app;