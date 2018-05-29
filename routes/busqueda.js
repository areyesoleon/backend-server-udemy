const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
app.get('/todo/:busqueda', (req, res) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda,'i');
  buscarHospitales(busqueda,regex)
  .then(hospitales =>{
    res.status(200).json({
      ok: true,
      hospitales:hospitales
    });
  });
});

function buscarHospitales(busqueda, regex){
  return new Promise((resolve,reject) =>{
    Hospital.find({nombre:regex},(err,hospitales) => {
      if(err){
        reject('Error al cargar hospitales',err);
      } else {
        resolve(hospitales)
      }
    });
  });
}

module.exports = app;