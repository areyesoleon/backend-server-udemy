const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', (req, res, next) => {
  Hospital.find({})
    .exec(
      (err, hospitales) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando hospital',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          hospitales: hospitales
        });
      });
});

app.put('/:id', mdAutenticacion.vericaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con el id ' + id + ' no existe',
        errors: {
          message: 'No existe un hospital con ese ID'
        }
      });
    }
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

app.post('/', mdAutenticacion.vericaToken, (req, res) => {
  const body = req.body;
  const hospital = new Hospital({
    nombre: body.nombre,
    usuario:req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });

});

app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
  const id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar hospital',
        errors: err
      });
    }
    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe hospital con ese ID',
        errors: { message: 'Hospital no existe' }
      });
    }
    res.status(200).json({
      ok: true,
      hospitals: hospitalBorrado
    });
  });
});

module.exports = app;