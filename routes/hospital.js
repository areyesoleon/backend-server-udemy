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
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }
      usuarioGuardado.password = ':)';
      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});

app.post('/', mdAutenticacion.vericaToken, (req, res) => {
  const body = req.body;
  const usuario = new Hospital({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuarios',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario,
    });
  });

});

app.delete('/:id', mdAutenticacion.vericaToken, (req, res) => {
  const id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe usuario con ese ID',
        errors: { message: 'Hospital no existe' }
      });
    }
    res.status(200).json({
      ok: true,
      usuarios: usuarioBorrado
    });
  });
});

module.exports = app;