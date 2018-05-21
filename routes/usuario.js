const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', (req, res, next) => {

  Usuario.find({}, 'nombre email img role')
    .exec(
      (err, usuarios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error cargando usuarios',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          usuarios: usuarios
        });
      });
});

app.put('/:id', mdAutenticacion.vericaToken,(req, res) => {
  const id = req.params.id;
  const body = req.body;
  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario con el id ' + id + ' no existe',
        errors: {
          message: 'No existe un usuario con ese ID'
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

app.post('/', mdAutenticacion.vericaToken , (req, res) => {
  const body = req.body;
  const usuario = new Usuario({
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
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
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
        errors: { message: 'Usuario no existe' }
      });
    }
    res.status(200).json({
      ok: true,
      usuarios: usuarioBorrado
    });
  });
});

module.exports = app;