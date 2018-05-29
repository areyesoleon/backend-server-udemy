const express = require('express');
const app = express();
const Medico = require('../models/medico');
const mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', (req, res, next) => {
  const desde = Number(req.query.desde) || 0;
  Medico.find({})
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .skip(desde)
    .limit(5)
    .exec(
      (err, medicos) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando medico',
            errors: err
          });
        }
        Medico.count((err,conteo) => {
          res.status(200).json({
            ok: true,
            medicos: medicos,
            total:conteo
          });
        });
      });
});

app.put('/:id', mdAutenticacion.vericaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con el id ' + id + ' no existe',
        errors: {
          message: 'No existe un medico con ese ID'
        }
      });
    }
    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar medico',
          errors: err
        });
      }
      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

app.post('/', mdAutenticacion.vericaToken, (req, res) => {
  const body = req.body;
  const medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear medico',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });
  });

});

app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
  const id = req.params.id;
  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar medico',
        errors: err
      });
    }
    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe medico con ese ID',
        errors: { message: 'Medico no existe' }
      });
    }
    res.status(200).json({
      ok: true,
      medicos: medicoBorrado
    });
  });
});

module.exports = app;